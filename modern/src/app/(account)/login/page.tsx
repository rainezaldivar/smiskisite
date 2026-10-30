import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/supabase/redirect";
import { AuthForm } from "@/components/account/auth-form";
import { AuthShell } from "@/components/account/auth-shell";
import { AccountUnavailable } from "@/components/account/account-unavailable";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  if (!isSupabaseConfigured()) return <AccountUnavailable />;
  const profile = await getCurrentProfile();
  if (profile)
    redirect(next === "/profile" && profile.role === "admin" ? "/admin" : next);
  return (
    <AuthShell
      title="Welcome back."
      description="Log in to manage your account and collection."
      split
    >
      {params.error === "confirmation" && (
        <p
          role="alert"
          className="mb-5 rounded-sm bg-danger-soft px-4 py-3 text-sm leading-6 text-danger"
        >
          That confirmation link is invalid or expired. Try opening the latest
          link from your inbox, or register again.
        </p>
      )}
      {params.notice === "confirmed" && (
        <p
          role="status"
          className="mb-5 rounded-sm bg-soft px-4 py-3 text-sm text-accent"
        >
          Email confirmed. You can log in now.
        </p>
      )}
      {params.notice === "signed-out" && (
        <p
          role="status"
          className="mb-5 rounded-sm bg-soft px-4 py-3 text-sm text-accent"
        >
          You’re signed out. See you again soon.
        </p>
      )}
      <AuthForm mode="login" next={next} />
    </AuthShell>
  );
}
