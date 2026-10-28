import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth";
import { AuthShell } from "@/components/account/auth-shell";
import { PasswordForm } from "@/components/account/password-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  await requireProfile("/reset-password");
  return (
    <AuthShell
      title="Make it yours again."
      description="Choose a new password for your account. Keep it somewhere safe."
    >
      <PasswordForm mode="reset" />
    </AuthShell>
  );
}
