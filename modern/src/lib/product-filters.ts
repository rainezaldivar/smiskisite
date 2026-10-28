import type { Product } from "@/lib/types";

// Preserve meaningful database categories and split the legacy "Others" bucket.
export function productCategory(product: Product): string {
  if (product.category.toLowerCase() !== "others") return product.category;
  const name = product.name.toLowerCase();
  if (name.includes("sticker")) return "Sticker";
  if (name.includes("hippers")) return "Hippers";
  if (name.includes("strap")) return "Strap Accessories";
  if (/light|lamp/.test(name)) return "Lights";
  if (name.includes("toothbrush")) return "Toothbrush Stand";
  if (name.includes("zipperbite")) return "Zipperbite";
  if (/key\s*chain/.test(name)) return "Keychains";
  if (name.includes("pouch")) return "Pouches";
  return product.category;
}

const seriesPatterns: Record<string, RegExp> = {
  birthday: /^smiski birthday/,
  sunday: /^smiski sunday/,
  moving: /^smiski moving series/,
  exercising: /^smiski exercis(?:e|ing) series/,
  dressing: /^smiski dressing/,
  work: /^smiski work series/,
  museum: /^smiski museum series/,
  cheer: /^smiski cheer series/,
  living: /^smiski living series/,
  bed: /^smiski bed series/,
  yoga: /^smiski yoga series/,
  bath: /^smiski bath series/,
  toilet: /^smiski toilet series/,
  series1: /^smiski series 1$/,
  series2: /^smiski series 2$/,
  series3: /^smiski series 3$/,
  series4: /^smiski series 4$/,
  hippers: /hippers/,
  "zipper-1": /zipperbite vol\.?\s*2/,
  "zipper-2": /zipperbite vol\.?\s*1/,
  keychain: /^smiski keychain/,
  strap1: /strap accessor(?:y|ies) series 1/,
  strap2: /strap accessor(?:y|ies) series 2/,
  strap3: /strap accessor(?:y|ies) series 3/,
  cushion: /cushion pouch/,
  "sticker-1": /sticker vol\.?\s*2/,
  "sticker-2": /sticker vol\.?\s*1/,
  plush: /^smiski plush$/,
  plushkey: /plush key\s*chain/,
  "light-1": /touch light(?: vol\.?\s*1)?$/,
  "light-2": /touch lamp|touch light vol\.?\s*2/,
  toothbrush: /toothbrush/,
  bobbing: /bobbing/,
  sensor: /sensor/,
  "bathball-1": /bath ball 2/,
  "bathball-2": /bath ball 1/,
};

export function matchesSeries(product: Product, seriesId: string): boolean {
  return seriesPatterns[seriesId]?.test(product.name.toLowerCase()) ?? false;
}

export function hasSecretCharacter(entry: {
  id: string;
  group: string;
}): boolean {
  return (
    entry.group === "figurines" ||
    entry.id === "hippers" ||
    /^strap[123]$/.test(entry.id)
  );
}
