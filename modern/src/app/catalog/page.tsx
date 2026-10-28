import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/content/catalog-browser";
import { series } from "@/lib/series";
export const metadata: Metadata = { title: "Collections" };
export default function CatalogPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="page-title mb-8">Collections</h1>
      <CatalogBrowser entries={series} />
    </div>
  );
}
