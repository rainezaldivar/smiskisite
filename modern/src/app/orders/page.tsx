import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { getOrders } from "@/lib/orders";
import { formatPrice, imageUrl } from "@/lib/utils";
export const metadata: Metadata = { title: "Your orders" };
export default async function OrdersPage() {
  const profile = await requireProfile("/orders");
  const orders = await getOrders(profile.id);
  return (
    <section className="container-page max-w-4xl py-12 sm:py-16">
      <p className="eyebrow">Your little collection</p>
      <h1 className="page-title mt-4">Your orders.</h1>
      <p className="muted mt-5 text-sm leading-7">
        Demonstration orders from your Smiskisite adventures. No real payments
        or deliveries.
      </p>
      {orders.length ? (
        <div className="mt-10 space-y-5">
          {orders.map((order) => (
            <article className="card p-6 sm:p-8" key={order.id}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold">
                    Order {order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <time
                    className="muted mt-2 block text-xs"
                    dateTime={order.created_at}
                  >
                    {new Intl.DateTimeFormat("en-PH", {
                      dateStyle: "medium",
                      timeZone: "Asia/Manila",
                    }).format(new Date(order.created_at))}
                  </time>
                </div>
                <span className="rounded-sm bg-sage px-4 py-2 text-[10px] font-bold uppercase tracking-wider">
                  {order.status} · demo
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {order.order_items.map((item) => (
                  <img
                    draggable={false}
                    key={item.product_id}
                    className="h-20 w-20 rounded-sm bg-soft object-contain p-2"
                    src={imageUrl(item.image)}
                    alt={`${item.product_name}, quantity ${item.quantity}`}
                  />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                <p className="text-sm font-bold">
                  {formatPrice(order.total)}
                  <span className="muted ml-2 font-normal">
                    ·{" "}
                    {order.order_items.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    )}{" "}
                    items
                  </span>
                </p>
                <Link
                  className="inline-flex items-center gap-2 text-xs font-bold"
                  href={`/checkout/success/${order.id}`}
                >
                  View order <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card mt-10 p-12 text-center">
          <Package size={34} className="mx-auto text-accent" />
          <h2 className="mt-5 text-xl font-bold">
            Your collection’s next chapter.
          </h2>
          <p className="muted mt-3 text-sm">
            Your demo orders will appear here once you place one.
          </p>
          <Link className="button-primary mt-6" href="/shop">
            Explore the shop
          </Link>
        </div>
      )}
    </section>
  );
}
