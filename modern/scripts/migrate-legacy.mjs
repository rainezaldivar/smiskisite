import { mkdir, writeFile, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { readLegacyExport, publicProduct } from "./legacy-data.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

export function classifyPassword(value) {
  if (typeof value !== "string" || !value) return "missing";
  if (/^\$2[aby]\$(0[4-9]|[12][0-9]|3[01])\$[./A-Za-z0-9]{53}$/.test(value))
    return "bcrypt";
  if (
    /^\$argon2(?:id|i)\$v=19\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/.test(
      value,
    )
  )
    return "argon2";
  if (value.startsWith("$")) return "unsupported-hash";
  return "plaintext";
}

function nullable(value) {
  return value === undefined || value === null || value === ""
    ? null
    : String(value);
}
function timestamp(value) {
  if (!value) return undefined;
  const text = String(value);
  const iso = /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/.test(text)
    ? `${text.replace(" ", "T")}Z`
    : text;
  if (!Number.isFinite(Date.parse(iso)))
    throw new Error("Invalid legacy timestamp.");
  return iso;
}
function profilePicture(value) {
  if (!value) return null;
  const text = String(value);
  if (/^https:\/\//.test(text)) return text;
  if (text.includes("..") || text.includes("\\"))
    throw new Error("Invalid legacy avatar path.");
  return text.startsWith("/uploads/")
    ? text
    : `/uploads/${text.replace(/^\/+/, "")}`;
}

export function validateExport(data, plaintext = "reject") {
  if (!["reject", "hash", "reset"].includes(plaintext))
    throw new Error("--plaintext must be reject, hash, or reset.");
  const products = data.products.map((row) => ({
    ...publicProduct(row),
    ...(row.created_at ? { created_at: timestamp(row.created_at) } : {}),
    ...(row.updated_at ? { updated_at: timestamp(row.updated_at) } : {}),
  }));
  if (new Set(products.map((row) => row.id)).size !== products.length)
    throw new Error("Duplicate legacy product IDs.");
  const ids = new Set();
  const emails = new Set();
  const counts = {
    bcrypt: 0,
    argon2: 0,
    plaintext: 0,
    missing: 0,
    "unsupported-hash": 0,
  };
  const users = data.users.map((row) => {
    const id = Number(row.id);
    const email = String(row.email || "")
      .trim()
      .toLowerCase();
    if (
      !Number.isSafeInteger(id) ||
      id < 1 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )
      throw new Error("Invalid legacy user identity.");
    if (ids.has(id) || emails.has(email))
      throw new Error(
        "Duplicate legacy user IDs or emails; reconcile the source first.",
      );
    ids.add(id);
    emails.add(email);
    if (!["admin", "customer"].includes(row.role))
      throw new Error(`Unknown role on legacy user ${id}.`);
    const passwordType = classifyPassword(row.password);
    counts[passwordType]++;
    if (passwordType === "unsupported-hash")
      throw new Error(
        `Unsupported password hash on legacy user ${id}; explicit credential recovery is required.`,
      );
    if (
      (passwordType === "plaintext" || passwordType === "missing") &&
      plaintext === "reject"
    ) {
      throw new Error(
        `Legacy user ${id} requires --plaintext=hash or --plaintext=reset. No users were imported.`,
      );
    }
    if (passwordType === "missing" && plaintext !== "reset")
      throw new Error(
        `Legacy user ${id} has no password; use --plaintext=reset.`,
      );
    const dob = nullable(row.dob);
    if (
      dob &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(dob) ||
        dob < "1900-01-01" ||
        !Number.isFinite(Date.parse(`${dob}T00:00:00Z`)) ||
        new Date(`${dob}T00:00:00Z`).toISOString().slice(0, 10) !== dob)
    ) {
      throw new Error(`Invalid birth date on legacy user ${id}.`);
    }
    const profile = {
      legacy_id: id,
      name: String(row.name || ""),
      email,
      role: row.role,
      profile_picture: profilePicture(row.profile_picture),
      phone: nullable(row.phone),
      gender: nullable(row.gender),
      dob,
      address: nullable(row.address),
      city: nullable(row.city),
      province: nullable(row.province),
      ...(row.created_at ? { created_at: timestamp(row.created_at) } : {}),
      ...(row.updated_at ? { updated_at: timestamp(row.updated_at) } : {}),
    };
    for (const [column, max] of [
      ["name", 200],
      ["phone", 40],
      ["gender", 40],
      ["address", 500],
      ["city", 120],
      ["province", 120],
    ]) {
      if (profile[column] && profile[column].length > max)
        throw new Error(
          `Profile ${column} exceeds supported length on legacy user ${id}.`,
        );
    }
    return { ...row, id, email, passwordType, profile };
  });
  return { products, users, counts };
}

async function getAllAuthUsers(client) {
  const users = [];
  for (let page = 1; ; page++) {
    const result = await client.auth.admin.listUsers({ page, perPage: 1000 });
    if (result.error)
      throw new Error(
        "Cannot list destination auth accounts. Check server credentials.",
      );
    users.push(...result.data.users);
    if (result.data.users.length < 1000) return users;
  }
}

export async function migrateLegacy(options = {}) {
  if (!options.input) {
    throw new Error("Provide --input=PATH to a private SQL or JSON export.");
  }
  const input = options.input;
  const plaintext = options.plaintext || "reject";
  const source = await readLegacyExport(input);
  const validated = validateExport(source, plaintext);
  const report = {
    mode: options.apply ? "apply" : "dry-run",
    generatedAt: new Date().toISOString(),
    sourceProducts: validated.products.length,
    sourceUsers: validated.users.length,
    passwordFormats: validated.counts,
    plaintextPolicy: plaintext,
    productsInserted: 0,
    productsSkipped: 0,
    usersCreated: 0,
    usersSkipped: 0,
    missingProductImages: [],
    complete: false,
  };
  for (const product of validated.products) {
    if (!/^https:\/\//.test(product.image)) {
      try {
        await access(join(root, "public/uploads", product.image));
      } catch {
        report.missingProductImages.push({
          productId: product.id,
          image: product.image,
        });
      }
    }
  }
  if (!options.apply) {
    report.complete = true;
    return report;
  }
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Apply requires NEXT_PUBLIC_SUPABASE_URL and server-only SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const targetProducts = await client
    .from("products")
    .select("id,name")
    .in(
      "id",
      validated.products.map((row) => row.id),
    );
  if (targetProducts.error)
    throw new Error(
      "Cannot read destination products. Apply the schema first.",
    );
  const productsById = new Map(targetProducts.data.map((row) => [row.id, row]));
  for (const product of validated.products) {
    const existing = productsById.get(product.id);
    if (existing && existing.name !== product.name)
      throw new Error(
        `Destination product ID ${product.id} has a different name. Resolve the collision before importing.`,
      );
  }
  const authUsers = await getAllAuthUsers(client);
  const usersByEmail = new Map(
    authUsers.map((user) => [user.email?.toLowerCase(), user]),
  );
  const existingProfiles = await client
    .from("profiles")
    .select("id,legacy_id")
    .not("legacy_id", "is", null);
  if (existingProfiles.error)
    throw new Error(
      "Cannot read destination profiles. Apply the schema first.",
    );
  const profilesByLegacy = new Map(
    existingProfiles.data.map((profile) => [
      Number(profile.legacy_id),
      profile,
    ]),
  );
  // Check every collision before the first mutation. An unrelated account is never overwritten or linked by email alone.
  for (const user of validated.users) {
    const existing = usersByEmail.get(user.email);
    const profile = profilesByLegacy.get(user.id);
    if (
      (existing && (!profile || profile.id !== existing.id)) ||
      (profile && (!existing || existing.id !== profile.id))
    ) {
      throw new Error(
        `Destination identity collision for legacy user ${user.id}. Reconcile manually; no existing account was modified.`,
      );
    }
  }
  let bcrypt;
  if (plaintext === "hash" && validated.counts.plaintext)
    bcrypt = await import("bcryptjs");
  const newProducts = validated.products.filter(
    (row) => !productsById.has(row.id),
  );
  if (newProducts.length) {
    const result = await client
      .from("products")
      .upsert(newProducts, { onConflict: "id", ignoreDuplicates: true })
      .select("id");
    if (result.error)
      throw new Error(
        "Product import failed; no existing stock was overwritten.",
      );
    report.productsInserted = result.data.length;
  }
  report.productsSkipped = validated.products.length - report.productsInserted;
  const sequenceResult = await client.rpc("sync_product_identity");
  if (sequenceResult.error)
    throw new Error("Product identity sequence could not be synchronized.");
  for (const user of validated.users) {
    if (usersByEmail.has(user.email)) {
      report.usersSkipped++;
      continue;
    }
    const attributes = {
      email: user.email,
      email_confirm: true,
      user_metadata: { name: user.profile.name, legacy_import_id: user.id },
    };
    if (user.passwordType === "bcrypt")
      attributes.password_hash = user.password.replace(/^\$2y\$/, "$2b$");
    else if (user.passwordType === "argon2")
      attributes.password_hash = user.password;
    else if (plaintext === "hash")
      attributes.password_hash = await bcrypt.hash(String(user.password), 12);
    else attributes.password = randomBytes(48).toString("base64url");
    const created = await client.auth.admin.createUser(attributes);
    if (created.error || !created.data.user)
      throw new Error(
        `Auth import failed for legacy user ${user.id}; check supported password hashes in your Supabase project.`,
      );
    const result = await client
      .from("profiles")
      .update(user.profile)
      .eq("id", created.data.user.id)
      .is("legacy_id", null)
      .select("id");
    if (result.error || result.data.length !== 1) {
      throw new Error(
        `Profile import failed after creating legacy user ${user.id}. Preserve that account and reconcile it before rerunning.`,
      );
    }
    report.usersCreated++;
  }
  report.complete = true;
  return report;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const argumentsList = process.argv.slice(2);
  const options = { apply: argumentsList.includes("--apply") };
  for (const argument of argumentsList) {
    if (argument.startsWith("--input="))
      options.input = resolve(argument.slice(8));
    else if (argument.startsWith("--plaintext="))
      options.plaintext = argument.slice(12);
    else if (argument !== "--apply")
      throw new Error(`Unknown option: ${argument.split("=")[0]}`);
  }
  try {
    const report = await migrateLegacy(options);
    await mkdir(join(root, ".migration"), { recursive: true });
    await writeFile(
      join(root, ".migration", "last-report.json"),
      `${JSON.stringify(report, null, 2)}\n`,
    );
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Migration failed.");
    process.exitCode = 1;
  }
}
