import { readdir, readFile } from "node:fs/promises";
import { resolve, join, extname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Optional: product and catalog files already deploy with modern/public/uploads.
// This copies files into an EXISTING public bucket without changing database paths.
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const args = process.argv.slice(2);
const bucket = args.find((arg) => arg.startsWith("--bucket="))?.slice(9);
const apply = args.includes("--apply");
if (!bucket || !/^[a-z0-9_-]+$/.test(bucket))
  throw new Error("Choose an existing bucket with --bucket=legacy-assets.");
if (args.some((arg) => arg !== "--apply" && !arg.startsWith("--bucket=")))
  throw new Error("Unknown asset upload option.");
const directory = join(root, "public/uploads");
const mime = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};
async function collect(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.isDirectory())
      files.push(...(await collect(join(path, entry.name))));
    else if (entry.isFile() && mime[extname(entry.name).toLowerCase()])
      files.push(join(path, entry.name));
  }
  return files;
}
const files = await collect(directory);
const mapping = files.map((file) => ({
  local: `/uploads/${relative(directory, file).split(sep).join("/")}`,
  object: relative(directory, file).split(sep).join("/"),
}));
if (apply) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  )
    throw new Error("Asset upload requires server-only Supabase credentials.");
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
  for (const [index, file] of files.entries()) {
    const result = await client.storage
      .from(bucket)
      .upload(mapping[index].object, await readFile(file), {
        contentType: mime[extname(file).toLowerCase()],
        upsert: false,
      });
    if (
      result.error &&
      !["409", "Duplicate"].includes(String(result.error.statusCode)) &&
      !/already exists/i.test(result.error.message)
    ) {
      throw new Error(
        `Asset upload failed for ${mapping[index].local}. Existing objects were not overwritten.`,
      );
    }
    mapping[index].url = client.storage
      .from(bucket)
      .getPublicUrl(mapping[index].object).data.publicUrl;
  }
}
console.log(
  JSON.stringify(
    {
      mode: apply ? "apply" : "dry-run",
      bucket,
      files: mapping.length,
      mapping,
    },
    null,
    2,
  ),
);
