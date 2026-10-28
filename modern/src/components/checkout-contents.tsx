"use client";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice, imageUrl } from "@/lib/utils";
import { placeDemoOrder } from "@/app/actions/checkout";
import type { Product } from "@/lib/types";
type DeliveryProfile = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
};

export function CheckoutContents({
  products,
  profile,
  canOrder,
  buyId,
  buyQuantity,
}: {
  products: Product[];
  profile: DeliveryProfile | null;
  canOrder: boolean;
  buyId: number | null;
  buyQuantity: number;
}) {
  const { items, ready, clearItems } = useCart();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const key = useRef<{ signature: string; id: string } | null>(null);
  const router = useRouter();
  const lines = buyId
    ? [{ productId: buyId, quantity: buyQuantity, selected: true }]
    : items.filter((item) => item.selected);
  const byId = new Map(products.map((product) => [product.id, product]));
  const invalid = lines.some(
    (line) =>
      !byId.has(line.productId) ||
      line.quantity > (byId.get(line.productId)?.stock ?? 0),
  );
  const subtotal = lines.reduce(
    (sum, line) => sum + (byId.get(line.productId)?.price ?? 0) * line.quantity,
    0,
  );
  const deliveryReady = !!(
    profile?.name &&
    profile.phone?.trim() &&
    profile.address?.trim() &&
    profile.city?.trim() &&
    profile.province?.trim()
  );
  if (!ready && !buyId)
    return (
      <p className="muted py-16" role="status">
        Preparing your checkout…
      </p>
    );
  if (!lines.length)
    return (
      <div className="card mt-10 p-12 text-center">
        <h2 className="text-xl font-bold">Choose a little companion first.</h2>
        <p className="muted mt-3 text-sm">
          Select the items you’d like to check out from your bag.
        </p>
        <Link className="button-primary mt-6" href="/cart">
          Back to your bag
        </Link>
      </div>
    );
  function submit() {
    const submitted = lines.map((line) => ({
      product_id: line.productId,
      quantity: line.quantity,
    }));
    const signature = JSON.stringify(
      [...submitted].sort((a, b) => a.product_id - b.product_id),
    );
    const attemptStorageKey = `smiskisite:checkout:${profile?.id ?? "guest"}`;
    if (!key.current || key.current.signature !== signature) {
      try {
        const stored = JSON.parse(
          sessionStorage.getItem(attemptStorageKey) ?? "null",
        );
        if (
          stored?.signature === signature &&
          typeof stored.id === "string" &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            stored.id,
          )
        )
          key.current = stored;
      } catch {
        /* A blocked storage provider still permits same-page retries. */
      }
      if (!key.current || key.current.signature !== signature)
        key.current = { signature, id: crypto.randomUUID() };
      try {
        sessionStorage.setItem(attemptStorageKey, JSON.stringify(key.current));
      } catch {
        /* Same-page retry remains idempotent. */
      }
    }
    const idempotencyKey = key.current.id;
    setError("");
    startTransition(async () => {
      try {
        const result = await placeDemoOrder({
          items: submitted,
          idempotencyKey,
        });
        if (result.error) {
          setError(result.error);
          return;
        }
        if (result.orderId) {
          try {
            sessionStorage.removeItem(attemptStorageKey);
          } catch {
            /* The order is already confirmed. */
          }
          if (!buyId) clearItems(lines.map((line) => line.productId));
          router.push(`/checkout/success/${result.orderId}`);
          router.refresh();
        }
      } catch {
        setError(
          "We couldn’t reach checkout. Please try again. No payment has been taken.",
        );
      }
    });
  }
  return (
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <MapPin size={20} />
              Delivery details
            </h2>
            {profile && (
              <Link
                className="text-xs font-bold underline"
                href={`/profile?next=${encodeURIComponent(buyId ? `/checkout?buy=${buyId}&quantity=${buyQuantity}` : "/checkout")}`}
              >
                Edit profile
              </Link>
            )}
          </div>
          {profile ? (
            <div className="mt-5 text-sm leading-7">
              <p className="font-bold">{profile.name}</p>
              <p className="muted">{profile.phone || "Add a phone number"}</p>
              <p className="muted">
                {[profile.address, profile.city, profile.province]
                  .filter(Boolean)
                  .join(", ") || "Add your delivery address in your profile."}
              </p>
              {!deliveryReady && (
                <p className="mt-3 text-[#9e4d37]">
                  Complete your phone number, address, city, and province before
                  placing an order.
                </p>
              )}
            </div>
          ) : (
            <p className="muted mt-5 text-sm leading-7">
              Your saved delivery details will appear here after you sign in.
            </p>
          )}
        </section>
        <section className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold">Your companions</h2>
          <div className="mt-5 divide-y divide-[#dfe5d6]">
            {lines.map((line) => {
              const product = byId.get(line.productId);
              return (
                <div
                  className="flex items-center gap-4 py-4"
                  key={line.productId}
                >
                  {product && (
                    <img
                      draggable={false}
                      src={imageUrl(product.image)}
                      alt={product.name}
                      className="h-20 w-20 rounded-sm bg-sage object-contain p-2"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      {product?.name ?? "Product unavailable"}
                    </p>
                    <p className="muted mt-1 text-xs">
                      Quantity: {line.quantity}
                    </p>
                    {(!product || line.quantity > product.stock) && (
                      <p className="mt-2 text-xs text-[#9e4d37]">
                        This quantity is no longer available.
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-bold">
                    {product ? formatPrice(product.price * line.quantity) : "—"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <aside className="card p-6 sm:p-8 lg:sticky lg:top-36">
        <h2 className="text-xl font-bold">Order summary</h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between">
            <dt className="muted">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="muted">Shipping</dt>
            <dd>{formatPrice(100)}</dd>
          </div>
          <div className="flex justify-between border-t border-[#dfe5d6] pt-5 text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal + 100)}</dd>
          </div>
        </dl>
        <div className="mt-6 rounded-sm bg-[#eef2e2] p-4 text-xs leading-6">
          <p className="flex items-center gap-2 font-bold">
            <ShieldCheck size={15} />
            Demo checkout
          </p>
          <p className="muted mt-2">
            This saves a demonstration order. No money is collected and no
            products will be shipped.
          </p>
        </div>
        {error && (
          <p
            className="mt-5 rounded-sm bg-[#fff0e9] p-3 text-sm text-[#98452f]"
            role="alert"
          >
            {error}
          </p>
        )}
        <button
          className="button-primary mt-6 w-full"
          disabled={!canOrder || !deliveryReady || invalid || pending}
          onClick={submit}
        >
          {pending ? "Saving your order…" : "Place demo order"}
          {!pending && <ArrowRight size={16} />}
        </button>
        {invalid && (
          <p className="mt-3 text-xs text-[#98452f]">
            Please update unavailable items in your bag first.
          </p>
        )}
        <Link
          className="mt-5 block text-center text-xs font-bold underline"
          href="/cart"
        >
          Back to your bag
        </Link>
      </aside>
    </div>
  );
}
