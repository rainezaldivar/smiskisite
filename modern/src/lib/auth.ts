import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/supabase/redirect";

export type Profile = {
  id: string;
  legacy_id: number | null;
  name: string;
  email: string;
  role: "customer" | "admin";
  profile_picture: string | null;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
};

export const PROFILE_COLUMNS =
  "id,legacy_id,name,email,role,profile_picture,phone,gender,dob,address,city,province";

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", user.id)
      .single();
    if (error || !data || !["customer", "admin"].includes(data.role))
      return null;
    return data as Profile;
  } catch {
    return null;
  }
});

export async function requireProfile(next = "/profile"): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile)
    redirect(`/login?next=${encodeURIComponent(safeNextPath(next))}`);
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile("/admin");
  if (profile.role !== "admin") redirect("/profile?notice=admin-only");
  return profile;
}
