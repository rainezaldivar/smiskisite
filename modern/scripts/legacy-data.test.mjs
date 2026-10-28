import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, join } from "node:path";
import { parseSqlTable, parsePhpArray, publicProduct } from "./legacy-data.mjs";
import { classifyPassword, validateExport } from "./migrate-legacy.mjs";

test("SQL parser preserves quoted separators, apostrophes, NULL, and multiple INSERT statements", () => {
  const source =
    "INSERT INTO `products` (`id`,`name`,`description`) VALUES (7,'Collector\\'s ; (box)','line\\nnext'),(9,'It''s green',NULL);\n" +
    "INSERT INTO `products` (`id`,`name`,`description`) VALUES (11,'Other','value');";
  assert.deepEqual(parseSqlTable(source, "products"), [
    { id: 7, name: "Collector's ; (box)", description: "line\nnext" },
    { id: 9, name: "It's green", description: null },
    { id: 11, name: "Other", description: "value" },
  ]);
});

test("PHP extraction supports nested arrays, escaped apostrophes and literal base_url only", () => {
  const source =
    "$items = [ // comment\n 'living' => ['name'=>'Can\\'t hide', 'variations'=>[['img'=>base_url('uploads/living.png')]]]];";
  assert.deepEqual(parsePhpArray(source, "items"), {
    living: {
      name: "Can't hide",
      variations: [{ img: "/uploads/living.png" }],
    },
  });
  assert.throws(
    () => parsePhpArray("$items = [system('anything')];", "items"),
    /Unsupported/,
  );
});

test("public product projection cannot include private user fields", () => {
  const row = publicProduct({
    id: 1,
    name: "Sample",
    price: "20.50",
    description: null,
    image: "sample.png",
    category: "Figurines",
    stock: 2,
    email: "private@example.test",
    password: "private",
    role: "admin",
  });
  assert.deepEqual(Object.keys(row).sort(), [
    "category",
    "description",
    "id",
    "image",
    "name",
    "price",
    "stock",
  ]);
  assert.equal(row.price, 20.5);
  assert.throws(
    () => publicProduct({ ...row, image: "../private" }),
    /image path/,
  );
});

test("migration requires explicit treatment of plaintext and rejects unknown hashes", () => {
  const products = [
    {
      id: 1,
      name: "Sample",
      price: 10,
      stock: 2,
      image: "sample.png",
      category: "Figurines",
    },
  ];
  const users = [
    {
      id: 4,
      name: "Student",
      email: "student@example.test",
      role: "customer",
      password: "classroom-password",
    },
  ];
  assert.throws(() => validateExport({ products, users }), /plaintext/);
  assert.equal(validateExport({ products, users }, "hash").counts.plaintext, 1);
  assert.equal(classifyPassword("$2y$10$" + "a".repeat(53)), "bcrypt");
  assert.equal(
    classifyPassword("$argon2id$v=19$m=65536,t=3,p=1$c2FsdA$aGFzaA"),
    "argon2",
  );
  assert.throws(
    () =>
      validateExport(
        { products, users: [{ ...users[0], password: "$unknown$hash" }] },
        "hash",
      ),
    /Unsupported/,
  );
  assert.throws(
    () => validateExport({ products, users: [users[0], users[0]] }, "hash"),
    /Duplicate/,
  );
});

test("extracted public datasets preserve all entries and reference actual local images", async () => {
  const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const products = JSON.parse(
    await readFile(join(root, "src/data/products.json"), "utf8"),
  );
  const series = JSON.parse(
    await readFile(join(root, "src/data/series.json"), "utf8"),
  );
  assert.equal(products.length, 42);
  assert.equal(series.length, 36);
  assert.equal(
    series.reduce((sum, row) => sum + row.variations.length, 0),
    126,
  );
  assert.equal(new Set(series.map((row) => row.id)).size, series.length);
  for (const row of products) {
    assert.deepEqual(Object.keys(row).sort(), [
      "category",
      "description",
      "id",
      "image",
      "name",
      "price",
      "stock",
    ]);
    await access(join(root, "public/uploads", row.image));
  }
  for (const row of series)
    for (const image of [
      row.image,
      row.coverImage,
      ...row.variations.map((variation) => variation.image),
    ].filter(Boolean)) {
      await access(join(root, "public", image));
    }
});
