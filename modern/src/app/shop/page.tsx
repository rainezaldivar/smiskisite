import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ShopBrowser } from "@/components/shop-browser";
export const metadata: Metadata = { title: "Shop" };
export default async function ShopPage() {
  const products = await getProducts();
  return (
    <section className="container-page py-12 sm:py-16">
      <p className="eyebrow">Find your little companion</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
        <h1 className="page-title">
          Small things.
          <br />
          Big happiness.
        </h1>
        <p className="muted max-w-xs text-sm leading-7">
          A quiet companion for every corner.
          <br />
          Which one feels like you?
        </p>
      </div>
      <ShopBrowser products={products} />
    </section>
  );
}
