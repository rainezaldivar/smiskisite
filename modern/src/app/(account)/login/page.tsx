import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/supabase/redirect";
import { AuthForm } from "@/components/account/auth-form";
import { AuthShell } from "@/components/account/auth-shell";
import { AccountUnavailable } from "@/components/account/account-unavailable";

export const metadata: Metadata = { title: "Sign in" };

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
      description="Your little corner of the Smiski world is waiting."
    >
      {params.error === "confirmation" && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
        >
          That confirmation link is invalid or expired. Try opening the latest
          link from your inbox, or register again.
        </p>
      )}
      {params.notice === "confirmed" && (
        <p
          role="status"
          className="mb-5 rounded-xl bg-[#edf4df] px-4 py-3 text-sm text-[#3b592c]"
        >
          Email confirmed. You can sign in now.
        </p>
      )}
      {params.notice === "signed-out" && (
        <p
          role="status"
          className="mb-5 rounded-xl bg-[#edf4df] px-4 py-3 text-sm text-[#3b592c]"
        >
          You’re signed out. See you again soon.
        </p>
      )}
      <AuthForm mode="login" next={next} />
    </AuthShell>
  );
}
