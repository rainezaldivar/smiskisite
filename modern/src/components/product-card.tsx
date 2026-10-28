import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, imageUrl } from "@/lib/utils";
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group min-w-0">
      <Link
        href={`/shop/${product.id}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[24px] border border-[#e2e8d9] bg-[#edf1e5] p-7">
          <img
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            src={imageUrl(product.image)}
            alt={product.name}
            loading="lazy"
          />
          <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest transition-colors group-hover:bg-lime">
            <ArrowUpRight size={17} />
          </span>
          {product.stock <= 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Sold out
            </span>
          )}
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[.14em] text-[#76846b]">
          {product.category}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-6">{product.name}</h3>
        <p className="mt-1 text-sm text-[#52664b]">
          {formatPrice(product.price)}
        </p>
      </Link>
    </article>
  );
}
