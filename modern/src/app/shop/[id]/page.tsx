import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, Sparkles, ShieldCheck } from "lucide-react";
import { getProduct, getProducts } from "@/lib/products";
import { formatPrice, imageUrl } from "@/lib/utils";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductCard } from "@/components/product-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(Number(id));
  return { title: product?.name ?? "Product not found" };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const product = await getProduct(Number(id));
  if (!product) notFound();
  const related = (await getProducts())
    .filter((item) => item.id !== product.id)
    .sort(
      (a, b) =>
        Number(b.category === product.category) -
        Number(a.category === product.category),
    )
    .slice(0, 4);
  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold"
      >
        <ArrowLeft size={15} />
        Back to all companions
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex aspect-square items-center justify-center rounded-[32px] bg-[#e9eedf] p-10 sm:p-16">
          <img
            src={imageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-contain"
            fetchPriority="high"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-.05em] sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 text-2xl font-bold">
            {formatPrice(product.price)}
          </p>
          <p className="muted mt-6 leading-8">
            {product.description ||
              "A curious little companion, ready to find a quiet corner in your everyday life."}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold">
            <span
              className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-[#78944e]" : "bg-[#a69c8c]"}`}
            />
            {product.stock > 0
              ? `${product.stock} available · ready for a new home`
              : "Currently sold out"}
          </div>
          <ProductPurchase product={product} />
          <div className="mt-8 grid gap-3 border-t border-[#dfe5d6] pt-6 text-xs text-[#657163]">
            <p className="flex items-center gap-3">
              <Sparkles size={16} />A little glow for your everyday
            </p>
            <p className="flex items-center gap-3">
              <Package size={16} />
              Blind-box contents vary by series
            </p>
            <p className="flex items-center gap-3">
              <ShieldCheck size={16} />
              Portfolio demo · no real payment collected
            </p>
          </div>
        </div>
      </div>
      <section className="mt-20">
        <p className="eyebrow">Good company</p>
        <h2 className="section-heading mt-3">More little discoveries.</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
