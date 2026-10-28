"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Series } from "@/lib/series";
import { imageUrl } from "@/lib/utils";

const groups = [
  { id: "all", label: "All collections" },
  { id: "figurines", label: "Figurines" },
  { id: "accessories", label: "Accessories" },
  { id: "lifestyle", label: "Lifestyle & home" },
] as const;

export function CatalogBrowser({ entries }: { entries: Series[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof groups)[number]["id"]>("all");
  const matches = useMemo(() => {
    const search = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const inGroup = group === "all" || entry.group === group;
      const text = `${entry.name} ${entry.description} ${entry.variations.map((item) => item.name).join(" ")}`;
      return inGroup && (!search || text.toLowerCase().includes(search));
    });
  }, [entries, query, group]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 border-b border-[#dce4d5] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Filter collections">
          {groups.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={group === item.id}
              onClick={() => setGroup(item.id)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${group === item.id ? "border-[#183d29] bg-[#183d29] text-white" : "border-[#dce4d5] bg-white text-[#36513e] hover:border-[#7e9866]"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="catalog-search" className="sr-only">
            Search collections and characters
          </label>
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-3.5 text-[#6b7e68]"
            aria-hidden="true"
          />
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a collection…"
            className="field w-full py-3 pl-11 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-2 rounded-full p-1.5 hover:bg-[#edf1e6]"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      <p className="mb-6 text-sm text-[#63715c]" role="status">
        {matches.length} {matches.length === 1 ? "collection" : "collections"}{" "}
        to discover
      </p>
      {matches.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {matches.map((entry) => (
            <Link
              key={entry.id}
              href={`/catalog/${entry.id}`}
              className="group overflow-hidden rounded-3xl border border-[#e1e8db] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#99ae7e] hover:shadow-sm"
            >
              <div className="m-3 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#f0f3e9] p-4 sm:m-4 sm:p-6">
                {/* Legacy assets include GIFs and transparent cutouts. */}
                <img
                  src={imageUrl(entry.image)}
                  alt={entry.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="px-4 pb-5 sm:px-5">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6a7d5c]">
                  {groups.find((item) => item.id === entry.group)?.label}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold leading-snug text-[#183d29] sm:text-base">
                    {entry.name}
                  </h2>
                  <ArrowRight
                    size={17}
                    className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#dce4d5] bg-white px-6 py-16 text-center">
          <Search
            size={32}
            className="mx-auto mb-4 text-[#7f966b]"
            aria-hidden="true"
          />
          <h2 className="text-xl font-semibold">No little creatures found</h2>
          <p className="muted mx-auto mt-2 max-w-sm">
            Try another collection name or explore a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setGroup("all");
            }}
            className="button-secondary mt-6"
          >
            Show all collections
          </button>
        </div>
      )}
    </div>
  );
}
