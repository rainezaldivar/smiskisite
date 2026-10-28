"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  createAdminClient,
  isAdminServiceConfigured,
} from "@/lib/supabase/admin";
import type { FormState } from "@/components/account/form-state";

export async function deleteCustomer(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  if (!isAdminServiceConfigured())
    return {
      status: "error",
      message:
        "Account deletion is unavailable. The site administrator must connect account management first.",
    };
  const parsed = z.string().uuid().safeParse(formData.get("userId"));
  if (!parsed.success || parsed.data === admin.id)
    return { status: "error", message: "This account cannot be deleted." };
  if (formData.get("confirmation") !== "delete")
    return {
      status: "error",
      message: "Confirm that you want to delete this customer.",
    };
  try {
    const supabase = createAdminClient();
    const { data: target, error: targetError } = await supabase
      .from("profiles")
      .select("id,role")
      .eq("id", parsed.data)
      .single();
    if (targetError || !target || target.role !== "customer")
      return {
        status: "error",
        message: "Only existing customer accounts can be deleted.",
      };
    const { count: orderCount, error: ordersError } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", target.id);
    if (ordersError)
      return {
        status: "error",
        message:
          "We could not check this account’s order history. No account was deleted.",
      };
    if (orderCount)
      return {
        status: "error",
        message:
          "This customer has orders. Their account is retained to preserve order history.",
      };
    // Supabase requires owned storage files to be removed before deleting a user.
    // Only this application's avatar bucket and the target user's folder are touched.
    let avatarFolderEmpty = false;
    for (let batch = 0; batch < 20; batch++) {
      const { data: files, error: listError } = await supabase.storage
        .from("avatars")
        .list(target.id, { limit: 100 });
      if (listError || !files)
        return {
          status: "error",
          message:
            "We could not review this customer’s uploaded photos. No account was deleted.",
        };
      if (!files.length) {
        avatarFolderEmpty = true;
        break;
      }
      if (files.some((file) => !file.id || file.name.includes("/")))
        return {
          status: "error",
          message:
            "This account’s uploaded files need administrator review before deletion.",
        };
      const { error: removeError } = await supabase.storage
        .from("avatars")
        .remove(files.map((file) => `${target.id}/${file.name}`));
      if (removeError)
        return {
          status: "error",
          message:
            "The uploaded photos could not be removed. No account was deleted.",
        };
    }
    if (!avatarFolderEmpty)
      return {
        status: "error",
        message:
          "This account has more uploaded files to review. Please try again.",
      };
    const { error } = await supabase.auth.admin.deleteUser(target.id);
    if (error)
      return {
        status: "error",
        message:
          "The account could not be deleted. It may have related records or uploaded files that need review.",
      };
  } catch {
    return {
      status: "error",
      message:
        "Account management could not be reached. Please try again shortly.",
    };
  }
  revalidatePath("/admin");
  return { status: "success", message: "Customer account deleted." };
}
