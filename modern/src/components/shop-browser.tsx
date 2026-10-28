"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { matchesSeries, productCategory } from "@/lib/product-filters";

export function ShopBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [optimisticParams, setOptimisticParams] = useOptimistic(
    urlSearchParams.toString(),
  );
  const searchParams = new URLSearchParams(optimisticParams);
  const query = searchParams.get("q") ?? "";
  const selectedCategories = searchParams.getAll("category");
  const seriesId = searchParams.get("series") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const stockOnly = searchParams.get("available") === "1";
  const categories = [...new Set(products.map(productCategory))].sort();
  const navigate = (params: URLSearchParams) => {
    params.delete("page");
    startTransition(() => {
      setOptimisticParams(params.toString());
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, {
        scroll: false,
      });
    });
  };
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    navigate(params);
  };
  const categoryMatches = (product: Product, category: string) =>
    [productCategory(product), product.category].some(
      (value) => value.toLowerCase() === category.toLowerCase(),
    );
  const toggleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    const selected = selectedCategories.some(
      (value) => value.toLowerCase() === category.toLowerCase(),
    );
    for (const value of selectedCategories) {
      if (value.toLowerCase() !== category.toLowerCase())
        params.append("category", value);
    }
    if (!selected) params.append("category", category);
    navigate(params);
  };
  const filtered = products.filter(
    (product) =>
      (!selectedCategories.length ||
        selectedCategories.some((category) =>
          categoryMatches(product, category),
        )) &&
      (!seriesId || matchesSeries(product, seriesId)) &&
      (!stockOnly || product.stock > 0) &&
      `${product.name} ${product.description} ${productCategory(product)}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  filtered.sort((a, b) => {
    const order =
      sort === "price_asc"
        ? a.price - b.price
        : sort === "price_desc"
          ? b.price - a.price
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : 0;
    return order || b.id - a.id;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const activePage = Math.min(
    Math.max(1, Number.parseInt(searchParams.get("page") ?? "1") || 1),
    pages,
  );
  return (
    <div className="shop-layout mt-8">
      <aside className="shop-sidebar" aria-label="Product filters">
        <fieldset>
          <legend className="mb-4 text-lg font-bold">Collections</legend>
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={selectedCategories.some(
                  (value) => value.toLowerCase() === category.toLowerCase(),
                )}
                onChange={() => toggleCategory(category)}
              />
              {category}
            </label>
          ))}
        </fieldset>
        <label className="mt-6 flex items-center gap-3 border-t border-[#dfe5d6] pt-5">
          <input
            type="checkbox"
            checked={stockOnly}
            onChange={(event) =>
              setFilter("available", event.target.checked ? "1" : "")
            }
          />
          In stock only
        </label>
        {(selectedCategories.length > 0 || seriesId || query || stockOnly) && (
          <button
            type="button"
            className="button-secondary mt-6"
            onClick={() => router.replace("/shop", { scroll: false })}
          >
            <X size={16} aria-hidden="true" /> Clear filters
          </button>
        )}
      </aside>
      <div className="min-w-0" aria-busy={pending}>
        <div className="flex flex-col gap-3 border-b border-[#dfe5d6] pb-5 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="absolute left-3 top-4 text-[#76846b]"
              size={18}
              aria-hidden="true"
            />
            <input
              className="field pl-10"
              aria-label="Search products"
              type="search"
              placeholder="Search products"
              value={query}
              onChange={(event) => setFilter("q", event.target.value)}
            />
          </div>
          <label className="flex min-w-0 items-center gap-3">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <span className="sr-only">Sort products</span>
            <select
              className="field min-w-0 sm:w-auto"
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
        <p className="muted my-5 text-sm" role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "companion" : "companions"}{" "}
          to discover
        </p>
        {filtered.length ? (
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {filtered
              .slice((activePage - 1) * 12, activePage * 12)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        ) : (
          <div className="card px-6 py-16 text-center">
            <h2 className="text-2xl font-bold">No companions found.</h2>
          </div>
        )}
        {pages > 1 && (
          <nav
            aria-label="Product pages"
            className="mt-10 flex flex-wrap justify-center gap-2"
          >
            {Array.from({ length: pages }, (_, index) => index + 1).map(
              (number) => (
                <button
                  type="button"
                  key={number}
                  aria-label={`Page ${number}`}
                  aria-current={activePage === number ? "page" : undefined}
                  className={`h-11 w-11 border text-base font-bold ${activePage === number ? "border-forest bg-forest text-white" : "border-[#d5dfc7] hover:bg-sage"}`}
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
    </div>
  );
}
