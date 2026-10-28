"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, UserRound, X, Sprout } from "lucide-react";
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
    { href: "/catalog", label: "Collections" },
    { href: "/about", label: "About SMISKI" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe5d6] bg-cream/95 backdrop-blur-md">
      <div className="container-page flex min-h-20 items-center justify-between gap-1 min-[400px]:gap-2">
        <Link
          href="/"
          aria-label="Smiskisite home"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-1 text-xl font-extrabold tracking-[-.07em] sm:gap-2 sm:text-2xl"
        >
          <Sprout
            size={24}
            strokeWidth={2.5}
            className="hidden min-[400px]:block"
            aria-hidden="true"
          />
          <span>
            smiskisite<span className="text-[#88a652]">.</span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={path.startsWith(link.href) ? "page" : undefined}
              className={`text-base font-bold transition-colors hover:text-[#6d8b3a] ${path.startsWith(link.href) ? "text-forest underline decoration-[#a4bd78] decoration-2 underline-offset-8" : "text-[#687564]"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          {profile?.role === "admin" && (
            <Link className="hidden text-xs font-bold sm:block" href="/admin">
              Admin
            </Link>
          )}
          <Link
            href={profile ? "/cart" : "/login?next=%2Fcart"}
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative p-1.5 min-[400px]:p-2"
            onClick={() => setOpen(false)}
          >
            <ShoppingCart size={23} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-sm bg-lime px-1 text-[9px] font-bold">
                {count}
              </span>
            )}
          </Link>
          {profile ? (
            <Link
              href="/profile"
              aria-label="Your profile"
              className="p-2"
              onClick={() => setOpen(false)}
            >
              <UserRound size={23} />
            </Link>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/register"
                className="nav-auth"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="nav-auth nav-login"
                onClick={() => setOpen(false)}
              >
                Log In
              </Link>
            </div>
          )}
          <button
            type="button"
            className="p-1 lg:hidden"
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
          className="container-page flex flex-col gap-1 border-t border-[#dfe5d6] py-4 lg:hidden"
        >
          {links.map((link) => (
            <Link
              className="rounded-sm px-3 py-3 text-sm font-bold hover:bg-sage"
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
