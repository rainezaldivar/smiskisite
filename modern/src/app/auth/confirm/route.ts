import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/supabase/redirect";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const next = safeNextPath(
    request.nextUrl.searchParams.get("next"),
    type === "recovery" ? "/reset-password" : "/profile",
  );
  if (
    tokenHash &&
    (type === "signup" || type === "email" || type === "recovery") &&
    isSupabaseConfigured()
  ) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });
      if (!error) return NextResponse.redirect(new URL(next, request.url));
    } catch {
      // Never include token details in a redirect or an error message.
    }
  }
  return NextResponse.redirect(
    new URL(
      type === "recovery"
        ? "/forgot-password?error=expired"
        : "/login?error=confirmation",
      request.url,
    ),
  );
}
