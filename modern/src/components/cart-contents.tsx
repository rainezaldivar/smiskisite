"use client";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice, imageUrl } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function CartContents({ products }: { products: Product[] }) {
  const { items, ready, setQuantity, selectItem, removeItem } = useCart();
  if (!ready)
    return (
      <p className="muted py-16" role="status">
        Opening your bag…
      </p>
    );
  if (!items.length)
    return (
      <div className="card mt-10 px-6 py-20 text-center">
        <ShoppingBag size={36} className="mx-auto text-accent" />
        <h2 className="mt-5 text-2xl font-bold">
          Every collection starts somewhere.
        </h2>
        <p className="muted mx-auto mt-3 max-w-sm text-sm leading-7">
          Your bag is waiting for its first little companion. Find one that
          makes you smile.
        </p>
        <Link href="/shop" className="button-primary mt-7">
          Explore the shop <ArrowRight size={16} />
        </Link>
      </div>
    );
  const byId = new Map(products.map((product) => [product.id, product]));
  const available = items.filter(
    (item) => (byId.get(item.productId)?.stock ?? 0) > 0,
  );
  const selected = items.filter((item) => item.selected);
  const invalid = selected.some(
    (item) => item.quantity > (byId.get(item.productId)?.stock ?? 0),
  );
  const subtotal = selected.reduce(
    (sum, item) => sum + (byId.get(item.productId)?.price ?? 0) * item.quantity,
    0,
  );
  const allSelected =
    available.length > 0 && available.every((item) => item.selected);
  return (
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="mb-5 flex items-center justify-between text-sm">
          <label className="flex items-center gap-3 font-bold">
            <input
              type="checkbox"
              aria-label="Select all available items"
              checked={allSelected}
              onChange={(event) => {
                const checked = event.target.checked;
                items.forEach((item) =>
                  selectItem(
                    item.productId,
                    checked && (byId.get(item.productId)?.stock ?? 0) > 0,
                  ),
                );
              }}
            />
            Select all available
          </label>
          <span className="muted text-xs">
            {items.length} {items.length === 1 ? "companion" : "companions"}
          </span>
        </div>
        <div className="card divide-y divide-line overflow-hidden">
          {items.map((item) => {
            const product = byId.get(item.productId);
            return (
              <article
                key={item.productId}
                className="flex items-start gap-3 p-4 sm:gap-5 sm:p-6"
              >
                <input
                  className="mt-9 shrink-0"
                  type="checkbox"
                  aria-label={`Select ${product?.name ?? "unavailable product"}`}
                  checked={item.selected}
                  onChange={(event) =>
                    selectItem(item.productId, event.target.checked)
                  }
                />
                {product ? (
                  <Link
                    href={`/shop/${product.id}`}
                    className="flex h-24 w-20 shrink-0 items-center rounded-sm bg-soft p-2 sm:w-24"
                  >
                    <img
                      draggable={false}
                      className="h-full w-full object-contain"
                      src={imageUrl(product.image)}
                      alt={product.name}
                    />
                  </Link>
                ) : (
                  <div className="flex h-24 w-20 items-center justify-center rounded-sm bg-sage">
                    <ShoppingBag size={24} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                    {product?.category ?? "Unavailable"}
                  </p>
                  <h2 className="mt-1 text-sm font-bold leading-6">
                    {product ? (
                      <Link href={`/shop/${product.id}`}>{product.name}</Link>
                    ) : (
                      "This companion is no longer available"
                    )}
                  </h2>
                  <p className="mt-1 text-sm">
                    {product ? formatPrice(product.price) : "—"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-sm border border-line">
                      <button
                        className="p-2"
                        aria-label={`Decrease ${product?.name ?? "item"} quantity`}
                        disabled={item.quantity <= 1 || !product}
                        onClick={() =>
                          setQuantity(
                            item.productId,
                            item.quantity - 1,
                            product?.stock ?? 0,
                          )
                        }
                      >
                        <Minus size={13} />
                      </button>
                      <span
                        aria-label="Quantity"
                        className="w-7 text-center text-xs font-bold"
                      >
                        {item.quantity}
                      </span>
                      <button
                        className="p-2"
                        aria-label={`Increase ${product?.name ?? "item"} quantity`}
                        disabled={
                          !product ||
                          item.quantity >= Math.min(product.stock, 99)
                        }
                        onClick={() =>
                          setQuantity(
                            item.productId,
                            item.quantity + 1,
                            product?.stock ?? 0,
                          )
                        }
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      className="p-2 text-muted hover:text-danger"
                      aria-label={`Remove ${product?.name ?? "item"}`}
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {product && item.quantity > product.stock && (
                    <p className="mt-2 text-xs text-danger">
                      {product.stock > 0
                        ? `Only ${product.stock} available. Please reduce the quantity.`
                        : "Currently sold out. Remove this item or leave it unselected."}
                    </p>
                  )}
                </div>
                <p className="hidden text-sm font-bold sm:block">
                  {product ? formatPrice(product.price * item.quantity) : "—"}
                </p>
              </article>
            );
          })}
        </div>
        <Link
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold"
          href="/shop"
        >
          Keep exploring <ArrowRight size={15} />
        </Link>
      </div>
      <aside className="card p-6 lg:sticky lg:top-36">
        <h2 className="text-xl font-bold tracking-tight">
          Your little summary
        </h2>
        <div className="mt-6 flex justify-between text-sm">
          <span className="muted">
            Selected items (
            {selected.reduce((sum, item) => sum + item.quantity, 0)})
          </span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <p className="muted mt-4 text-xs leading-6">
          Shipping is calculated at checkout.
          <br />
          This is a portfolio demo. No real payment is collected.
        </p>
        <div className="my-6 border-t border-line" />
        <div className="flex justify-between font-bold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {selected.length > 0 && !invalid ? (
          <Link className="button-primary mt-6 w-full" href="/checkout">
            Continue to checkout <ArrowRight size={16} />
          </Link>
        ) : (
          <button className="button-primary mt-6 w-full" disabled>
            {invalid
              ? "Update quantities to continue"
              : "Select items to continue"}
          </button>
        )}
      </aside>
    </div>
  );
}
