import "server-only";

import snapshot from "@/data/products.json";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export type { Product } from "@/lib/types";

const columns = "id,name,price,description,image,category,stock";

function hasDatabaseConfiguration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url && !key) return false;
  if (!url || !key) throw new Error("Supabase configuration is incomplete.");
  return true;
}

function toProduct(row: Record<string, unknown>): Product {
  const id = Number(row.id);
  const price = Number(row.price);
  const stock = Number(row.stock);
  if (
    !Number.isSafeInteger(id) ||
    !Number.isFinite(price) ||
    !Number.isInteger(stock)
  ) {
    throw new Error("The product database returned an invalid record.");
  }
  const image = String(row.image || "default.png");
  return {
    id,
    name: String(row.name),
    price,
    description: String(row.description || ""),
    image:
      image.startsWith("/") || image.startsWith("https://")
        ? image
        : `/uploads/${image}`,
    category: String(row.category),
    stock,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!hasDatabaseConfiguration())
    return snapshot.map((row) => toProduct(row)).sort((a, b) => b.id - a.id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(columns)
    .order("id", { ascending: false });
  if (error)
    throw new Error(
      "Products could not be loaded from the configured database.",
    );
  return (data || []).map((row) => toProduct(row));
}

export async function getProduct(id: number): Promise<Product | null> {
  if (!Number.isSafeInteger(id) || id < 1) return null;
  if (!hasDatabaseConfiguration()) {
    const row = snapshot.find((product) => product.id === id);
    return row ? toProduct(row) : null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(columns)
    .eq("id", id)
    .maybeSingle();
  if (error)
    throw new Error(
      "The product could not be loaded from the configured database.",
    );
  return data ? toProduct(data) : null;
}
