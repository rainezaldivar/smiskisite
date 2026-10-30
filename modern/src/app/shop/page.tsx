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
    <section className="container-page py-6 sm:py-8">
      <h1 className={entry ? "section-heading" : "sr-only"}>
        {entry?.name ?? "Shop"}
      </h1>
      <ShopBrowser products={products} />
    </section>
  );
}
