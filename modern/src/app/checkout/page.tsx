import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getProducts } from "@/lib/products";
import { CheckoutContents } from "@/components/checkout-contents";
export const metadata: Metadata = { title: "Checkout" };
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const buy =
    typeof query.buy === "string" && /^\d+$/.test(query.buy)
      ? Number(query.buy)
      : null;
  const quantity =
    typeof query.quantity === "string"
      ? Math.max(1, Math.min(99, Number.parseInt(query.quantity) || 1))
      : 1;
  const profile = await getCurrentProfile();
  const products = await getProducts();
  return (
    <section className="container-page py-12 sm:py-16">
      <p className="eyebrow">One step closer</p>
      <h1 className="page-title mt-4">A new home awaits.</h1>
      {!isSupabaseConfigured() && (
        <div className="mt-7 rounded-sm border border-line bg-soft p-5 text-sm leading-7">
          <strong>Checkout isn’t available yet.</strong>
          <p className="muted">
            You can explore the shop and build your bag. Account services need
            to be connected before orders can be placed.
          </p>
        </div>
      )}
      {isSupabaseConfigured() && !profile && (
        <div className="card mt-7 p-5 text-sm">
          <p>
            Please sign in to save your delivery details and place a demo order.
          </p>
          <Link
            className="button-primary mt-4"
            href={`/login?next=${encodeURIComponent(buy ? `/checkout?buy=${buy}&quantity=${quantity}` : "/checkout")}`}
          >
            Sign in to continue
          </Link>
        </div>
      )}
      <CheckoutContents
        products={products}
        profile={
          profile
            ? {
                id: profile.id,
                name: profile.name,
                phone: profile.phone,
                address: profile.address,
                city: profile.city,
                province: profile.province,
              }
            : null
        }
        canOrder={!!profile && isSupabaseConfigured()}
        buyId={buy}
        buyQuantity={quantity}
      />
    </section>
  );
}
