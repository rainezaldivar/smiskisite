import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ShopBrowser } from "@/components/shop-browser";
import { getSeries } from "@/lib/series";
export const metadata: Metadata = { title: "Shop" };
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string }>;
}) {
  const products = await getProducts();
  const { series: seriesId } = await searchParams;
  const entry = seriesId ? getSeries(seriesId) : undefined;
  return (
    <section className="container-page py-8 sm:py-12">
      <h1 className="page-title">{entry?.name ?? "Shop"}</h1>
      <ShopBrowser products={products} />
    </section>
  );
}
