import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AccountUnavailable } from "@/components/account/account-unavailable";
import { AuthShell } from "@/components/account/auth-shell";
import { PasswordForm } from "@/components/account/password-form";

export const metadata: Metadata = { title: "Reset your password" };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!isSupabaseConfigured())
    return <AccountUnavailable title="Password recovery is unavailable" />;
  const { error } = await searchParams;
  return (
    <AuthShell
      title="A fresh start."
      description="Enter your account’s email address to request a password reset link."
    >
      {error === "expired" && (
        <p
          role="alert"
          className="mb-5 rounded-sm bg-danger-soft px-4 py-3 text-sm leading-6 text-danger"
        >
          That reset link is invalid or expired. Request a new one below.
        </p>
      )}
      <PasswordForm mode="request" />
    </AuthShell>
  );
}
