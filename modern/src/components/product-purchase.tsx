"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { clampQuantity } from "@/lib/cart";
import { useCart } from "@/components/cart-provider";

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, items } = useCart();
  const router = useRouter();
  const inBag =
    items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const remaining = Math.max(0, Math.min(product.stock, 99) - inBag);
  function add() {
    if (remaining < 1) return;
    addItem(product.id, Math.min(quantity, remaining), product.stock);
    setAdded(true);
  }
  return (
    <div className="mt-8">
      <label className="field-label" htmlFor="product-quantity">
        Quantity
      </label>
      <div className="inline-flex items-center rounded-full border border-[#cbd6bd] bg-white">
        <button
          className="p-3"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() =>
            setQuantity(clampQuantity(quantity - 1, product.stock))
          }
        >
          <Minus size={16} />
        </button>
        <input
          id="product-quantity"
          className="w-12 bg-transparent text-center text-sm font-bold"
          type="number"
          min="1"
          max={Math.min(product.stock, 99)}
          value={quantity}
          onChange={(event) => {
            setQuantity(
              clampQuantity(Number(event.target.value), product.stock),
            );
            setAdded(false);
          }}
        />
        <button
          className="p-3"
          aria-label="Increase quantity"
          disabled={quantity >= Math.min(product.stock, 99)}
          onClick={() => {
            setQuantity(clampQuantity(quantity + 1, product.stock));
            setAdded(false);
          }}
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          className="button-primary"
          disabled={remaining < 1}
          onClick={add}
        >
          {added ? <Check size={17} /> : <ShoppingBag size={17} />}{" "}
          {product.stock <= 0
            ? "Sold out"
            : remaining < 1
              ? "All available items in bag"
              : added
                ? "Added to your bag"
                : "Add to bag"}
        </button>
        <button
          className="button-secondary"
          disabled={product.stock <= 0}
          onClick={() =>
            router.push(`/checkout?buy=${product.id}&quantity=${quantity}`)
          }
        >
          Buy now
        </button>
      </div>
      <div
        role="status"
        aria-live="polite"
        className="min-h-6 pt-3 text-xs text-[#52664b]"
      >
        {added && (
          <>
            Your companion is waiting in your{" "}
            <Link href="/cart" className="font-bold underline">
              shopping bag
            </Link>
            .
          </>
        )}
      </div>
    </div>
  );
}
