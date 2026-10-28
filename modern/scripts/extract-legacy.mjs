import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  readLegacyExport,
  publicProduct,
  parsePhpArray,
} from "./legacy-data.mjs";

export async function extractLegacy(
  root = resolve(fileURLToPath(new URL("..", import.meta.url))),
) {
  const legacyRoot = resolve(root, "..");
  const { products } = await readLegacyExport(
    join(legacyRoot, "smiski_db.sql"),
  );
  const catalog = await readFile(
    join(legacyRoot, "app/Views/Catalog.php"),
    "utf8",
  );
  const details = parsePhpArray(
    await readFile(join(legacyRoot, "app/Views/details.php"), "utf8"),
    "all_products",
  );
  const entries = [
    ...parsePhpArray(catalog, "blind_box_series").map((row) => ({
      ...row,
      group: "figurines",
    })),
    ...parsePhpArray(catalog, "accessories").map((row) => ({
      ...row,
      group: "accessories",
    })),
    ...parsePhpArray(catalog, "lifestyle").map((row) => ({
      ...row,
      group: "lifestyle",
    })),
  ];
  const duplicates = new Map();
  for (const row of entries)
    duplicates.set(row.id, (duplicates.get(row.id) || 0) + 1);
  const seen = new Map();
  const missing = new Set();
  async function existingImage(path, fallback) {
    try {
      await access(join(root, "public", path));
      return path;
    } catch {
      missing.add(path);
      return fallback;
    }
  }
  const series = [];
  for (const row of entries) {
    seen.set(row.id, (seen.get(row.id) || 0) + 1);
    const detail = details[row.id];
    const id =
      duplicates.get(row.id) > 1 ? `${row.id}-${seen.get(row.id)}` : row.id;
    const image = await existingImage(row.img, "/uploads/default.png");
    const variations = [];
    for (const variation of detail?.variations || [])
      variations.push({
        name: variation.name,
        description: variation.desc,
        image: await existingImage(variation.img, image),
      });
    series.push({
      id,
      legacyId: row.id,
      name: row.name,
      description: detail?.desc || "",
      image,
      ...(detail?.img
        ? { coverImage: await existingImage(detail.img, image) }
        : {}),
      ...(detail?.katakana ? { katakana: detail.katakana } : {}),
      variations,
      group: row.group,
    });
  }
  const dataPath = join(root, "src/data");
  await mkdir(dataPath, { recursive: true });
  await writeFile(
    join(dataPath, "products.json"),
    `${JSON.stringify(products.map(publicProduct), null, 2)}\n`,
  );
  await writeFile(
    join(dataPath, "series.json"),
    `${JSON.stringify(series, null, 2)}\n`,
  );
  const report = {
    products: products.length,
    series: series.length,
    variations: series.reduce((sum, row) => sum + row.variations.length, 0),
    missingLegacyImagePaths: [...missing].sort(),
    duplicateLegacyIds: [...duplicates]
      .filter(([, count]) => count > 1)
      .map(([id, count]) => ({ id, count })),
  };
  await writeFile(
    join(dataPath, "extraction-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  return report;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log(JSON.stringify(await extractLegacy(), null, 2));
}
