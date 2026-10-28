"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, UserRound, X, Sprout } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function SiteHeader({
  profile,
}: {
  profile: { name: string; role: string } | null;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const links = [
    { href: "/shop", label: "Shop" },
    { href: "/catalog", label: "Collector’s guide" },
    { href: "/about", label: "Our little world" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe5d6] bg-cream/95 backdrop-blur-md">
      <div className="bg-forest px-4 py-2 text-center text-[10px] font-bold tracking-[.18em] text-[#edf4dd]">
        LITTLE CREATURES. EVERYDAY JOY.
      </div>
      <div className="container-page flex h-20 items-center justify-between gap-5">
        <Link
          href="/"
          aria-label="Smiskisite home"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 text-2xl font-extrabold tracking-[-.07em]"
        >
          <Sprout size={24} strokeWidth={2.5} />
          <span>
            smiskisite<span className="text-[#88a652]">.</span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={path.startsWith(link.href) ? "page" : undefined}
              className={`text-[13px] font-bold transition-colors hover:text-[#6d8b3a] ${path.startsWith(link.href) ? "text-forest underline decoration-[#a4bd78] decoration-2 underline-offset-8" : "text-[#687564]"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 sm:gap-5">
          {profile?.role === "admin" && (
            <Link className="hidden text-xs font-bold sm:block" href="/admin">
              Admin
            </Link>
          )}
          <Link
            href={profile ? "/profile" : "/login"}
            aria-label={profile ? "Your profile" : "Sign in"}
            className="flex items-center gap-2 text-xs font-bold"
          >
            <UserRound size={20} />
            <span className="hidden lg:block">
              {profile ? profile.name.split(" ")[0] : "Sign in"}
            </span>
          </Link>
          <Link
            href="/cart"
            aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative p-2"
          >
            <ShoppingBag size={21} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-lime px-1 text-[9px] font-bold">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="p-2 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="container-page flex flex-col gap-1 border-t border-[#dfe5d6] py-4 md:hidden"
        >
          {links.map((link) => (
            <Link
              className="rounded-xl px-3 py-3 text-sm font-bold hover:bg-sage"
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {profile?.role === "admin" && (
            <Link
              className="px-3 py-3 text-sm font-bold"
              href="/admin"
              onClick={() => setOpen(false)}
            >
              Admin dashboard
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
