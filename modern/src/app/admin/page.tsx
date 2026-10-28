import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, Shield, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import {
  createAdminClient,
  isAdminServiceConfigured,
} from "@/lib/supabase/admin";
import { DeleteCustomerForm } from "@/components/account/delete-customer-form";

export const metadata: Metadata = { title: "Manage users" };

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  created_at: string;
};
const pageSize = 8;

function listHref(page: number, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("page", String(page));
  return `/admin?${params}`;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "")
    .trim()
    .slice(0, 80);
  const safeQuery = query.replace(/[^\p{L}\p{N}\s@.+-]/gu, " ").trim();
  const requestedPage = Math.max(
    1,
    Math.min(100000, Number.parseInt(params.page || "1", 10) || 1),
  );
  let page = requestedPage;
  let total = 0;
  let customerCount = 0;
  let adminCount = 0;
  let filteredCount = 0;
  let users: UserRow[] = [];
  let unavailable = !isAdminServiceConfigured();

  if (!unavailable) {
    try {
      const supabase = createAdminClient();
      let filtered = supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      if (safeQuery)
        filtered = filtered.or(
          `name.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%`,
        );
      const counts = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "customer"),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "admin"),
        filtered,
      ]);
      if (counts.some((result) => result.error)) unavailable = true;
      else {
        [total, customerCount, adminCount, filteredCount] = counts.map(
          (result) => result.count || 0,
        );
        page = Math.min(
          requestedPage,
          Math.max(1, Math.ceil(filteredCount / pageSize)),
        );
        let rows = supabase
          .from("profiles")
          .select("id,name,email,role,created_at")
          .order("created_at", { ascending: false })
          .order("id")
          .range((page - 1) * pageSize, page * pageSize - 1);
        if (safeQuery)
          rows = rows.or(
            `name.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%`,
          );
        const { data, error } = await rows;
        if (error) unavailable = true;
        else users = (data || []) as UserRow[];
      }
    } catch {
      unavailable = true;
    }
  }

  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize));
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#737d6b] hover:text-[#344d31]"
      >
        <ArrowLeft size={14} aria-hidden /> Back to my account
      </Link>
      <div className="mt-7 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829568]">
            Administration
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#293329] sm:text-4xl">
            People in our little world.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#737d6b]">
            Find registered users and manage customer accounts.
          </p>
        </div>
        <span className="hidden size-14 items-center justify-center rounded-sm bg-[#e7efd9] text-[#58723d] sm:flex">
          <Shield size={25} aria-hidden />
        </span>
      </div>
      {unavailable ? (
        <div
          role="status"
          className="mt-9 rounded-sm border border-[#dfe5d2] bg-white/80 p-8"
        >
          <h2 className="text-xl font-semibold text-[#293329]">
            User management is unavailable
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#737d6b]">
            The site’s account management service needs to be connected, or is
            temporarily unavailable. Your administrator access is still
            protected. Please try again later.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Registered users", count: total },
              { label: "Customers", count: customerCount },
              { label: "Administrators", count: adminCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-sm border border-[#dfe5d2] bg-white/80 p-5"
              >
                <p className="text-xs text-[#737d6b]">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-[#344d31]">
                  {stat.count}
                </p>
              </div>
            ))}
          </div>
          <section
            aria-label="Registered users"
            className="mt-6 overflow-hidden rounded-sm border border-[#dfe5d2] bg-white/80"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6eadf] p-5 sm:p-6">
              <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#293329]">
                <Users size={19} aria-hidden /> Registered users
              </h2>
              <form
                action="/admin"
                method="get"
                className="flex w-full gap-2 sm:w-auto"
              >
                <label htmlFor="user-search" className="sr-only">
                  Search by name or email
                </label>
                <input
                  id="user-search"
                  name="q"
                  defaultValue={query}
                  maxLength={80}
                  placeholder="Search name or email"
                  className="min-w-0 flex-1 rounded-sm border border-[#dce2d2] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#728c57] sm:w-56"
                />
                <button
                  type="submit"
                  aria-label="Search users"
                  className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[#344d31] text-white hover:bg-[#243c22]"
                >
                  <Search size={17} aria-hidden />
                </button>
              </form>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Registered users, with customer account deletion controls
                </caption>
                <thead className="bg-[#f5f7ef] text-xs font-medium text-[#737d6b]">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e9ede3]">
                  {users.length ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-5 font-medium text-[#293329]">
                          {user.name}
                          {user.id === admin.id && (
                            <span className="ml-2 text-xs font-normal text-[#829568]">
                              You
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-[#737d6b]">
                          {user.email}
                        </td>
                        <td className="px-6 py-5">
                          <span className="rounded-sm bg-[#edf3df] px-3 py-1 text-xs capitalize text-[#58723d]">
                            {user.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-xs text-[#737d6b]">
                          {new Intl.DateTimeFormat("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "Asia/Manila",
                          }).format(new Date(user.created_at))}
                        </td>
                        <td className="px-6 py-5">
                          {user.role === "customer" && user.id !== admin.id ? (
                            <DeleteCustomerForm id={user.id} name={user.name} />
                          ) : (
                            <span className="text-xs text-[#829568]">
                              Protected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-[#737d6b]"
                      >
                        {query
                          ? "No users matched that search."
                          : "No registered users yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e6eadf] px-6 py-5">
              <p className="text-xs text-[#737d6b]">
                {filteredCount
                  ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredCount)} of ${filteredCount}`
                  : "0 users"}
                {query && " matching users"}
              </p>
              <nav
                aria-label="User list pagination"
                className="flex items-center gap-3"
              >
                {page > 1 && (
                  <Link
                    href={listHref(page - 1, query)}
                    className="rounded-sm border border-[#dce2d2] p-2 text-[#344d31] hover:bg-[#edf3df]"
                    aria-label="Previous page"
                  >
                    <ArrowLeft size={15} aria-hidden />
                  </Link>
                )}
                <span className="text-xs text-[#737d6b]">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={listHref(page + 1, query)}
                    className="rounded-sm border border-[#dce2d2] p-2 text-[#344d31] hover:bg-[#edf3df]"
                    aria-label="Next page"
                  >
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                )}
              </nav>
            </div>
          </section>
          <p className="mt-5 max-w-2xl text-xs leading-6 text-[#829077]">
            Administrator accounts are protected. Customer accounts with orders
            are retained to preserve order history. Deleting an eligible account
            permanently removes its sign-in and profile.
          </p>
        </>
      )}
    </div>
  );
}
