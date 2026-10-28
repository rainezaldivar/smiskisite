"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const checkoutSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            product_id: z.number().int().positive(),
            quantity: z.number().int().min(1).max(99),
          })
          .strict(),
      )
      .min(1)
      .max(50),
    idempotencyKey: z.uuid(),
  })
  .strict();
export async function placeDemoOrder(
  input: unknown,
): Promise<{ orderId?: string; error?: string }> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success)
    return { error: "Please check the items and quantities in your bag." };
  const profile = await requireProfile("/checkout");
  if (
    !profile.name.trim() ||
    !profile.address?.trim() ||
    !profile.city?.trim() ||
    !profile.province?.trim() ||
    !profile.phone?.trim()
  )
    return {
      error:
        "Please complete your name, phone number, and delivery address in your profile first.",
    };
  const client = await createClient();
  const { data, error } = await client.rpc("place_demo_order", {
    p_items: parsed.data.items,
    p_idempotency_key: parsed.data.idempotencyKey,
  });
  if (error) {
    if (/stock|available/i.test(error.message))
      return {
        error:
          "One of your companions no longer has enough stock. Return to your bag to update the quantity.",
      };
    if (/address|profile/i.test(error.message))
      return {
        error: "Please complete your delivery details in your profile.",
      };
    if (/idempotency|different/i.test(error.message))
      return {
        error:
          "Your bag changed during checkout. Refresh this page and try again.",
      };
    return {
      error:
        "We couldn’t save your order. Please try again. No payment has been taken.",
    };
  }
  if (typeof data !== "string")
    return {
      error:
        "We couldn’t confirm your order. Please try again with the same items.",
    };
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/orders");
  return { orderId: data };
}
