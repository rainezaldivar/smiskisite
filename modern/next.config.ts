import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  async redirects() {
    return [
      { source: "/customer", destination: "/", permanent: true },
      { source: "/customer/home", destination: "/", permanent: true },
      { source: "/customer/shop", destination: "/shop", permanent: true },
      { source: "/customer/catalog", destination: "/catalog", permanent: true },
      { source: "/customer/about", destination: "/about", permanent: true },
      { source: "/customer/cart", destination: "/cart", permanent: true },
      { source: "/customer/profile", destination: "/profile", permanent: true },
      { source: "/shop/cart", destination: "/cart", permanent: true },
      { source: "/shop/checkout", destination: "/checkout", permanent: true },
      {
        source: "/shop/product/:id",
        destination: "/shop/:id",
        permanent: true,
      },
      {
        source: "/customer/product_details/:id",
        destination: "/shop/:id",
        permanent: true,
      },
      ...["zipper", "sticker", "light", "bathball"].map((slug) => ({
        source: "/details",
        has: [{ type: "query" as const, key: "item", value: slug }],
        destination: `/catalog/${slug}-1`,
        permanent: true,
      })),
      {
        source: "/details",
        has: [{ type: "query", key: "item", value: "(?<slug>[a-zA-Z0-9_-]+)" }],
        destination: "/catalog/:slug",
        permanent: true,
      },
      { source: "/details", destination: "/catalog", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
