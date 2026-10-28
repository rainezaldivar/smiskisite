import "server-only";
import { createClient } from "@/lib/supabase/server";
export type OrderItem = {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  image: string;
};
export type Order = {
  id: string;
  user_id: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  delivery_name: string;
  delivery_address: string;
  delivery_city: string;
  delivery_province: string;
  order_items: OrderItem[];
};
const columns =
  "id,user_id,subtotal,shipping,total,status,payment_method,created_at,delivery_name,delivery_address,delivery_city,delivery_province,order_items(product_id,product_name,unit_price,quantity,image)";
function normalizeOrder(row: Record<string, unknown>): Order {
  return {
    ...row,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    order_items: (row.order_items as Record<string, unknown>[]).map((item) => ({
      ...item,
      unit_price: Number(item.unit_price),
    })),
  } as Order;
}
export async function getOrders(userId: string): Promise<Order[]> {
  const client = await createClient();
  const { data, error } = await client
    .from("orders")
    .select(columns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Your orders could not be loaded.");
  return (data ?? []).map((row) => normalizeOrder(row));
}
export async function getOrder(
  id: string,
  userId: string,
): Promise<Order | null> {
  const client = await createClient();
  const { data, error } = await client
    .from("orders")
    .select(columns)
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error("Your order could not be loaded.");
  return data ? normalizeOrder(data) : null;
}
