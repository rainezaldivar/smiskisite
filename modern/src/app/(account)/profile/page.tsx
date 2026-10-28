import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, LogOut, Package, Shield } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { safeNextPath } from "@/lib/supabase/redirect";
import { logout } from "@/app/actions/auth";
import {
  AvatarForm,
  ProfileDetailsForm,
} from "@/components/account/profile-form";

export const metadata: Metadata = { title: "My account" };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; next?: string }>;
}) {
  const profile = await requireProfile();
  const params = await searchParams;
  const returnPath = safeNextPath(params.next);
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829568]">
        My account
      </p>
      <div className="mb-9 mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#293329] sm:text-4xl">
            Your little corner.
          </h1>
          <p className="mt-3 text-sm text-[#737d6b]">
            Keep the essentials together, and get back to discovering.
          </p>
        </div>
        <Link
          href={returnPath === "/profile" ? "/catalog" : returnPath}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#344d31]"
        >
          {returnPath.startsWith("/checkout")
            ? "Back to checkout"
            : returnPath === "/profile"
              ? "Explore the collection"
              : "Return to previous page"}{" "}
          <ArrowUpRight size={16} aria-hidden />
        </Link>
      </div>
      {params.notice === "admin-only" && (
        <p
          role="alert"
          className="mb-6 rounded-sm bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          That page is available to administrators only.
        </p>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-sm border border-[#dfe5d2] bg-white/80 p-6 text-center">
          <AvatarForm profile={profile} />
          <nav
            aria-label="Account links"
            className="mt-6 space-y-2 border-t border-[#e6eadf] pt-5 text-left"
          >
            <Link
              href="/orders"
              className="flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-medium text-[#374333] hover:bg-[#edf3df]"
            >
              <Package size={17} aria-hidden /> My demo orders
            </Link>
            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-medium text-[#374333] hover:bg-[#edf3df]"
              >
                <Shield size={17} aria-hidden /> Manage users
              </Link>
            )}
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left text-sm font-medium text-[#737d6b] hover:bg-[#f3f3ed]"
              >
                <LogOut size={17} aria-hidden /> Sign out
              </button>
            </form>
          </nav>
        </aside>
        <section
          aria-label="Edit your profile"
          className="rounded-sm border border-[#dfe5d2] bg-white/80 p-6 sm:p-8"
        >
          <ProfileDetailsForm profile={profile} />
        </section>
      </div>
    </div>
  );
}
