import Link from "next/link";
import { ArrowUpRight, Sprout } from "lucide-react";
export function SiteFooter() {
  return (
    <footer className="relative mt-10 border-t border-line bg-soft">
      <div className="container-page grid gap-12 py-13 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link
            className="flex items-center gap-2 text-2xl font-extrabold tracking-[-.06em]"
            href="/"
          >
            <Sprout size={24} />
            smiskisite.
          </Link>
          <p className="muted mt-4 max-w-xs text-sm leading-7">
            A little corner for curious collectors.
            <br />
            Find a companion. Bring home a glow.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-5">Explore</p>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/shop">Shop all companions</Link>
            <Link href="/catalog">Collections</Link>
            <Link href="/about">About SMISKI</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-5">Account</p>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/profile">My profile</Link>
            <Link href="/cart">Shopping bag</Link>
            <a
              className="flex items-center gap-1"
              href="https://smiski.com/e/"
              target="_blank"
              rel="noreferrer"
            >
              Official Smiski website <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col justify-between gap-3 border-t border-line py-6 text-[11px] leading-5 text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} Smiskisite. Made with care by a Smiski
          fan.
        </p>
        <p>
          Student portfolio demo. Unofficial and not affiliated with Smiski or
          Dreams Inc.
        </p>
      </div>
    </footer>
  );
}
