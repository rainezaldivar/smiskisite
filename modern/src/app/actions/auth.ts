"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  createAdminClient,
  isAdminServiceConfigured,
} from "@/lib/supabase/admin";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/supabase/redirect";
import { newPasswordSchema } from "@/lib/supabase/validation";
import { requireProfile } from "@/lib/auth";
import type { FormState } from "@/components/account/form-state";

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(256),
});

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name.").max(80),
    surname: z.string().trim().min(1, "Enter your surname.").max(80),
    email: z.string().trim().email("Enter a valid email address.").max(254),
    password: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function unavailable(): FormState {
  return {
    status: "error",
    message:
      "Accounts are unavailable right now. Please try again after the site is connected.",
  };
}

function siteUrl() {
  try {
    const url = new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    );
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

async function invalidCredentialsState(email: string): Promise<FormState> {
  const fallback: FormState = {
    status: "error",
    message: "The email or password is incorrect.",
  };
  if (!isAdminServiceConfigured()) return fallback;

  try {
    // ILIKE is case-insensitive; escape pattern characters in the supplied email.
    const exactEmail = email.replace(
      /[\\%_]/g,
      (character) => `\\${character}`,
    );
    const { data, error } = await createAdminClient()
      .from("profiles")
      .select("email")
      .ilike("email", exactEmail)
      .limit(10);
    if (error || !data) return fallback;
    const accountExists = data.some(
      (profile) => profile.email.toLowerCase() === email.toLowerCase(),
    );
    if (!accountExists && data.length === 10) return fallback;
    return accountExists
      ? {
          status: "error",
          message: "",
          errors: { password: ["Your password is incorrect."] },
        }
      : {
          status: "error",
          message: "",
          errors: { email: ["This account does not exist."] },
        };
  } catch {
    return fallback;
  }
}

export async function login(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) return unavailable();
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success)
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) {
      if (error.code === "invalid_credentials")
        return await invalidCredentialsState(parsed.data.email);
      return {
        status: "error",
        message:
          error.code === "email_not_confirmed"
            ? "Confirm your email using the link in your inbox, then log in."
            : "We could not sign you in. Try again shortly.",
      };
    }
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .single();
    if (profileError || !profile) {
      await supabase.auth.signOut({ scope: "local" });
      return {
        status: "error",
        message:
          "Your account profile is not available yet. Please contact the site administrator before trying again.",
      };
    }
  } catch {
    return {
      status: "error",
      message:
        "The account service could not be reached. Please try again shortly.",
    };
  }
  revalidatePath("/", "layout");
  redirect(safeNextPath(formData.get("next")));
}

export async function register(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) return unavailable();
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  let signedIn = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          name: `${parsed.data.firstName} ${parsed.data.surname}`,
          first_name: parsed.data.firstName,
          surname: parsed.data.surname,
        },
        emailRedirectTo: `${siteUrl()}/auth/callback?next=/profile`,
      },
    });
    if (error)
      return {
        status: "error",
        message:
          "We could not create your account. Try again shortly, or log in if you already have an account.",
      };
    signedIn = Boolean(data.session);
  } catch {
    return {
      status: "error",
      message:
        "The account service could not be reached. Please try again shortly.",
    };
  }
  if (!signedIn)
    return {
      status: "success",
      message:
        "Check your inbox for a confirmation link. If this address already has an account, you can log in instead.",
    };
  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // The local browser session must still be removed during a service outage.
    }
    const { url } = getSupabaseConfig();
    const storageKey = `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
    const cookieStore = await cookies();
    cookieStore.getAll().forEach(({ name }) => {
      if (name === storageKey || name.startsWith(`${storageKey}.`))
        cookieStore.delete(name);
    });
  }
  revalidatePath("/", "layout");
  redirect("/login?notice=signed-out");
}

export async function requestPasswordReset(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) return unavailable();
  const parsed = z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254)
    .safeParse(formData.get("email"));
  if (!parsed.success)
    return {
      status: "error",
      message: "Enter a valid email address.",
      errors: { email: ["Enter a valid email address."] },
    };
  try {
    const supabase = await createClient();
    // Keep the same response for unknown addresses and provider rejections.
    // This form never discloses whether an address has an account.
    await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
    });
  } catch {
    return {
      status: "error",
      message:
        "The recovery service could not be reached. Please try again shortly.",
    };
  }
  return {
    status: "success",
    message:
      "If an account uses that address, you’ll receive a password reset link. Check your inbox and spam folder.",
  };
}

export async function resetPassword(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireProfile("/reset-password");
  const parsed = z
    .object({ password: newPasswordSchema, confirmPassword: z.string() })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    })
    .safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
  if (!parsed.success)
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    if (error)
      return {
        status: "error",
        message:
          error.code === "same_password"
            ? "Choose a password you haven’t used for this account."
            : error.code === "weak_password"
              ? "Choose a stronger password with a mix of letters, numbers, and symbols."
              : "Your password could not be updated. Request a fresh reset link and try again.",
      };
    try {
      await supabase.auth.signOut({ scope: "others" });
    } catch {
      // Password change succeeded. Do not ask the user to repeat a completed change.
    }
  } catch {
    return {
      status: "error",
      message:
        "The account service could not be reached. Please try again shortly.",
    };
  }
  revalidatePath("/", "layout");
  return { status: "success", message: "Your password has been updated." };
}
