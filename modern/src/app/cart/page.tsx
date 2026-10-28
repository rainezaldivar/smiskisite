import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { CartContents } from "@/components/cart-contents";
export const metadata: Metadata = { title: "Your shopping bag" };
export default async function CartPage() {
  const products = await getProducts();
  return (
    <section className="container-page py-12 sm:py-16">
      <p className="eyebrow">Your little collection</p>
      <h1 className="page-title mt-4">A bag full of joy.</h1>
      <CartContents products={products} />
    </section>
  );
}
