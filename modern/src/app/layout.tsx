import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/auth";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ImageProtection } from "@/components/image-protection";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Smiskisite — a little glow for your everyday",
    template: "%s | Smiskisite",
  },
  description:
    "Explore the curious world of Smiski. Discover your favorite series, find a little companion, and start your collection.",
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
              const saved = localStorage.getItem("smiskisite:theme");
              document.documentElement.dataset.theme = saved === "dark" || saved === "light"
                ? saved
                : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            } catch {
              document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark" : "light";
            }`,
          }}
        />
      </head>
      <body>
        <ImageProtection />
        <CartProvider userId={profile?.id ?? null}>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <SiteHeader
            profile={
              profile ? { name: profile.name, role: profile.role } : null
            }
          />
          <main id="main-content" className="min-h-[65vh]">
            {children}
          </main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
