import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthForm } from "@/components/account/auth-form";
import { AuthShell } from "@/components/account/auth-shell";
import { AccountUnavailable } from "@/components/account/account-unavailable";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  if (!isSupabaseConfigured()) return <AccountUnavailable />;
  if (await getCurrentProfile()) redirect("/profile");
  return (
    <AuthShell
      title="Find your people."
      description="Join the family and start your own little collection."
      split
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
