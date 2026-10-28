import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const customer = "10000000-0000-4000-8000-000000000001";
const otherCustomer = "10000000-0000-4000-8000-000000000002";
const requestId = "20000000-0000-4000-8000-000000000001";

test("schema enforces owner access, atomic demo checkout and idempotent retries", async (t) => {
  const db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create schema storage;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon,authenticated,service_role;
    grant execute on function auth.uid() to anon,authenticated,service_role;
    create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
    create function storage.foldername(name text) returns text[] language sql immutable as
      $$ select (string_to_array(name,'/'))[1:array_length(string_to_array(name,'/'),1)-1] $$;
    grant usage on schema storage to anon,authenticated,service_role;
    grant select on storage.objects to anon;
    grant select,insert,update,delete on storage.objects to authenticated;
    grant execute on function storage.foldername(text) to anon,authenticated,service_role;
    alter table storage.objects enable row level security;
  `);
  await db.exec(
    await readFile(
      new URL(
        "../supabase/migrations/202610280001_initial.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await db.query(
    "insert into auth.users(id,email,raw_user_meta_data) values ($1,'one@example.test',$3::jsonb),($2,'two@example.test','{}')",
    [
      customer,
      otherCustomer,
      JSON.stringify({ name: "Customer", role: "admin" }),
    ],
  );
  await db.exec(
    "insert into products(id,name,price,stock,image) values (1,'Figurine',500,5,'figure.png'),(2,'Keychain',100,1,'keychain.png'),(3,'Sold out',200,0,'sold.png')",
  );
  await db.query(
    "update profiles set name='Customer',phone='123',address='Campus address',city='Campus City',province='Metro Province' where id=$1",
    [customer],
  );
  async function asUser(id) {
    await db.exec("reset role; set role authenticated");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  }
  async function place(items, key = requestId) {
    const result = await db.query(
      "select public.place_demo_order($1::jsonb,$2::uuid) as id",
      [JSON.stringify(items), key],
    );
    return result.rows[0].id;
  }
  await asUser(customer);
  await t.test(
    "signup role metadata cannot grant admin and direct role/identity writes fail",
    async () => {
      assert.equal(
        (await db.query("select role from profiles")).rows[0].role,
        "customer",
      );
      await assert.rejects(
        db.query("update profiles set role='admin' where id=$1", [customer]),
        /permission denied/i,
      );
      await assert.rejects(
        db.query("update profiles set legacy_id=99 where id=$1", [customer]),
        /permission denied/i,
      );
      await assert.rejects(
        db.query("select public.sync_product_identity()"),
        /permission denied/i,
      );
      await assert.rejects(
        db.query("select public.handle_new_user()"),
        /permission denied/i,
      );
      await assert.rejects(
        db.query("select public.sync_profile_email()"),
        /permission denied/i,
      );
      await db.query("update profiles set phone='123' where id=$1", [customer]);
      assert.equal(
        (await db.query("select count(*)::int as n from profiles")).rows[0].n,
        1,
      );
    },
  );
  await t.test(
    "RPC rejects every missing required delivery field including whitespace-only values",
    async () => {
      const completeProfile = {
        name: "Customer",
        phone: "123",
        address: "Campus address",
        city: "Campus City",
        province: "Metro Province",
      };
      for (const [column, value] of Object.entries(completeProfile)) {
        await db.query(`update profiles set ${column}='   ' where id=$1`, [
          customer,
        ]);
        await assert.rejects(
          place([{ product_id: 1, quantity: 1 }]),
          /complete delivery address/i,
        );
        await db.query(`update profiles set ${column}=$1 where id=$2`, [
          value,
          customer,
        ]);
      }
      assert.equal(
        (await db.query("select count(*)::int as n from orders")).rows[0].n,
        0,
      );
      assert.equal(
        (await db.query("select stock from products where id=1")).rows[0].stock,
        5,
      );
    },
  );
  let orderId;
  await t.test(
    "checkout uses stored prices and atomically persists order items and decrements stock",
    async () => {
      orderId = await place([{ product_id: 1, quantity: 2, price: 1 }]);
      const order = (
        await db.query("select * from orders where id=$1", [orderId])
      ).rows[0];
      assert.equal(Number(order.subtotal), 1000);
      assert.equal(Number(order.total), 1100);
      assert.equal(order.payment_method, "demo");
      assert.equal(order.delivery_address, "Campus address");
      assert.equal(
        (await db.query("select stock from products where id=1")).rows[0].stock,
        3,
      );
      const item = (
        await db.query("select * from order_items where order_id=$1", [orderId])
      ).rows[0];
      assert.equal(Number(item.unit_price), 500);
      assert.equal(item.quantity, 2);
      await assert.rejects(
        db.query("update products set stock=100 where id=1"),
        /permission denied/i,
      );
      await assert.rejects(
        db.query("insert into orders(user_id) values ($1)", [customer]),
        /permission denied/i,
      );
    },
  );
  await t.test(
    "retry returns the same order and does not deduct stock again",
    async () => {
      assert.equal(await place([{ product_id: 1, quantity: 2 }]), orderId);
      assert.equal(
        (await db.query("select stock from products where id=1")).rows[0].stock,
        3,
      );
      await assert.rejects(
        place([{ product_id: 1, quantity: 1 }]),
        /different cart/i,
      );
      assert.equal(
        (await db.query("select count(*)::int as n from orders")).rows[0].n,
        1,
      );
    },
  );
  await t.test(
    "unavailable or malformed carts cannot partially consume stock or create orders",
    async () => {
      const nextId = "20000000-0000-4000-8000-000000000002";
      await assert.rejects(
        place(
          [
            { product_id: 1, quantity: 1 },
            { product_id: 2, quantity: 2 },
          ],
          nextId,
        ),
        /Insufficient stock/i,
      );
      for (const items of [
        [],
        [{ product_id: 1, quantity: 0 }],
        [{ product_id: 1, quantity: 1.5 }],
        [{ product_id: 1, quantity: 100 }],
        [
          { product_id: 1, quantity: 1 },
          { product_id: 1, quantity: 1 },
        ],
        [{ product_id: 999, quantity: 1 }],
      ]) {
        await assert.rejects(place(items, nextId));
      }
      assert.equal(
        (await db.query("select stock from products where id=1")).rows[0].stock,
        3,
      );
      assert.equal(
        (await db.query("select stock from products where id=2")).rows[0].stock,
        1,
      );
      assert.equal(
        (await db.query("select count(*)::int as n from orders")).rows[0].n,
        1,
      );
    },
  );
  await t.test(
    "another customer cannot see the first customer's order or order items",
    async () => {
      await asUser(otherCustomer);
      assert.equal(
        (await db.query("select count(*)::int as n from orders")).rows[0].n,
        0,
      );
      assert.equal(
        (await db.query("select count(*)::int as n from order_items")).rows[0]
          .n,
        0,
      );
      await assert.rejects(
        place([{ product_id: 1, quantity: 1 }]),
        /delivery address/i,
      );
      await db.query(
        "insert into storage.objects(bucket_id,name) values ('avatars',$1)",
        [`${otherCustomer}/avatar.png`],
      );
      await assert.rejects(
        db.query(
          "insert into storage.objects(bucket_id,name) values ('avatars',$1)",
          [`${customer}/avatar.png`],
        ),
        /row.level security/i,
      );
    },
  );
  await t.test(
    "guest can browse products but cannot place an order or read profiles",
    async () => {
      await db.exec("reset role; set role anon");
      await db.query("select set_config('request.jwt.claim.sub','',false)");
      assert.equal(
        (await db.query("select count(*)::int as n from products")).rows[0].n,
        3,
      );
      await assert.rejects(
        place([{ product_id: 1, quantity: 1 }]),
        /permission denied/i,
      );
      await assert.rejects(
        db.query("select * from profiles"),
        /permission denied/i,
      );
    },
  );
  await t.test(
    "import sequence synchronization and account deletion preserve data integrity",
    async () => {
      await db.exec("reset role");
      await db.query(
        "update profiles set created_at='2025-01-01T00:00:00Z',updated_at='2025-06-01T00:00:00Z' where id=$1",
        [customer],
      );
      const preserved = (
        await db.query(
          "select created_at,updated_at from profiles where id=$1",
          [customer],
        )
      ).rows[0];
      assert.equal(
        new Date(preserved.created_at).toISOString(),
        "2025-01-01T00:00:00.000Z",
      );
      assert.equal(
        new Date(preserved.updated_at).toISOString(),
        "2025-06-01T00:00:00.000Z",
      );
      await db.query("select public.sync_product_identity()");
      assert.equal(
        (
          await db.query(
            "insert into products(name,price,stock) values ('New product',20,1) returning id",
          )
        ).rows[0].id,
        4,
      );
      await assert.rejects(
        db.query("delete from auth.users where id=$1", [customer]),
        /foreign key/i,
      );
    },
  );
  await db.close();
});
