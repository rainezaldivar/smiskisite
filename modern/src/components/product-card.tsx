import Link from "next/link";
import { productCategory } from "@/lib/product-filters";
import type { Product } from "@/lib/types";
import { formatPrice, imageUrl } from "@/lib/utils";
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="store-card">
      <Link
        href={`/shop/${product.id}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className="store-card-image">
          <img
            draggable={false}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            src={imageUrl(product.image)}
            alt={product.name}
            loading="lazy"
          />
          {product.stock <= 0 && (
            <span className="absolute left-4 top-4 rounded-sm bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Sold out
            </span>
          )}
        </div>
        <div className="store-card-copy">
          <p className="muted text-sm">{productCategory(product)}</p>
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
