"use client";

import { Search, X } from "lucide-react";
import { CollectionCard } from "@/components/content/collection-card";
import { useMemo, useState } from "react";
import type { Series } from "@/lib/series";

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
              className={`rounded-sm border px-4 py-2.5 text-sm font-medium transition-colors ${group === item.id ? "border-[#183d29] bg-[#183d29] text-white" : "border-[#dce4d5] bg-white text-[#36513e] hover:border-[#7e9866]"}`}
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
              className="absolute right-2 top-2 rounded-sm p-1.5 hover:bg-[#edf1e6]"
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {matches.map((entry) => (
            <CollectionCard key={entry.id} entry={entry} heading="h2" />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-[#dce4d5] bg-white px-6 py-16 text-center">
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
