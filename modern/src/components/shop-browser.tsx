"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

export function ShopBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const stockOnly = searchParams.get("available") === "1";
  const categories = [
    ...new Set(products.map((product) => product.category)),
  ].sort();
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.replace(`${pathname}?${params}`, { scroll: false });
  };
  const filtered = products.filter(
    (product) =>
      (!category ||
        product.category.toLowerCase() === category.toLowerCase()) &&
      (!stockOnly || product.stock > 0) &&
      `${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  filtered.sort((a, b) =>
    sort === "price_asc"
      ? a.price - b.price
      : sort === "price_desc"
        ? b.price - a.price
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : b.id - a.id,
  );
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1") || 1,
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const activePage = Math.min(page, pages);
  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#dfe5d6] bg-white/60 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-3.5 text-[#76846b]"
            size={17}
          />
          <input
            className="field pl-10"
            aria-label="Search products"
            type="search"
            placeholder="Search for a little friend…"
            value={query}
            onChange={(event) => setFilter("q", event.target.value)}
          />
        </div>
        <label className="flex items-center gap-3">
          <SlidersHorizontal size={17} />
          <span className="sr-only">Sort products</span>
          <select
            className="field w-auto min-w-40"
            value={sort}
            onChange={(event) => setFilter("sort", event.target.value)}
          >
            <option value="latest">Latest arrivals</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          className={`rounded-full border px-4 py-2 text-xs font-bold ${!category ? "border-forest bg-forest text-white" : "border-[#d5dfc7] hover:bg-sage"}`}
          onClick={() => setFilter("category", "")}
        >
          All companions
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter("category", cat)}
            className={`rounded-full border px-4 py-2 text-xs font-bold ${category.toLowerCase() === cat.toLowerCase() ? "border-forest bg-forest text-white" : "border-[#d5dfc7] hover:bg-sage"}`}
          >
            {cat.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </button>
        ))}
      </div>
      <div className="mb-7 mt-7 flex flex-wrap items-center justify-between gap-4 text-xs text-[#657163]">
        <p>
          {filtered.length} {filtered.length === 1 ? "companion" : "companions"}{" "}
          to discover
        </p>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={stockOnly}
            onChange={(event) =>
              setFilter("available", event.target.checked ? "1" : "")
            }
          />
          In stock only
        </label>
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {filtered
            .slice((activePage - 1) * 12, activePage * 12)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      ) : (
        <div className="card px-6 py-20 text-center">
          <Search size={28} className="mx-auto text-[#8ca577]" />
          <h2 className="mt-5 text-xl font-bold">No companions found.</h2>
          <p className="muted mt-2 text-sm">
            Try another name or a different category.
          </p>
          <button
            className="button-secondary mt-6"
            onClick={() => router.replace("/shop", { scroll: false })}
          >
            <X size={15} />
            Clear filters
          </button>
        </div>
      )}
      {pages > 1 && (
        <nav
          aria-label="Product pages"
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {Array.from({ length: pages }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                aria-label={`Page ${number}`}
                aria-current={activePage === number ? "page" : undefined}
                className={`h-10 w-10 rounded-full text-sm font-bold ${activePage === number ? "bg-forest text-white" : "border border-[#d5dfc7] hover:bg-sage"}`}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(number));
                  router.push(`${pathname}?${params}`, { scroll: false });
                }}
              >
                {number}
              </button>
            ),
          )}
        </nav>
      )}
    </div>
  );
}
