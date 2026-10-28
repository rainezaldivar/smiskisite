import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { getOrder } from "@/lib/orders";
import { formatPrice, imageUrl } from "@/lib/utils";
export const metadata: Metadata = { title: "Your demo order" };
export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    notFound();
  const profile = await requireProfile(`/checkout/success/${id}`);
  const order = await getOrder(id, profile.id);
  if (!order) notFound();
  return (
    <section className="container-page max-w-3xl py-14 sm:py-20">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm bg-lime">
          <Check size={30} />
        </div>
        <p className="eyebrow mt-6">A little joy, saved</p>
        <h1 className="page-title mt-4">Your demo order is in.</h1>
        <p className="muted mx-auto mt-5 max-w-md text-sm leading-7">
          Thanks, {order.delivery_name.split(" ")[0]}. This is a demonstration
          order: no payment was taken and nothing will be shipped.
        </p>
        <p className="mt-4 text-xs font-bold">
          Order {order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>
      <div className="card mt-10 p-6 sm:p-8">
        <h2 className="text-lg font-bold">Your little companions</h2>
        <div className="mt-5 divide-y divide-[#dfe5d6]">
          {order.order_items.map((item) => (
            <div className="flex items-center gap-4 py-4" key={item.product_id}>
              <img
                draggable={false}
                className="h-20 w-20 rounded-sm bg-sage object-contain p-2"
                src={imageUrl(item.image)}
                alt={item.product_name}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{item.product_name}</p>
                <p className="muted mt-1 text-xs">
                  {item.quantity} × {formatPrice(item.unit_price)}
                </p>
              </div>
              <p className="text-sm font-bold">
                {formatPrice(item.unit_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <dl className="mt-5 space-y-3 border-t border-[#dfe5d6] pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="muted">Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="muted">Shipping</dt>
            <dd>{formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-[#dfe5d6] pt-6">
          <h3 className="text-xs font-bold">Saved delivery details</h3>
          <p className="muted mt-2 text-sm leading-7">
            {order.delivery_name}
            <br />
            {[
              order.delivery_address,
              order.delivery_city,
              order.delivery_province,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link className="button-primary" href="/shop">
          Keep exploring <ArrowRight size={16} />
        </Link>
        <Link className="button-secondary" href="/orders">
          All your orders
        </Link>
      </div>
    </section>
  );
}
