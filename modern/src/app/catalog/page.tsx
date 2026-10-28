import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { CatalogBrowser } from "@/components/content/catalog-browser";
import { series } from "@/lib/series";

export const metadata: Metadata = {
  title: "Collector’s dictionary",
  description:
    "Explore Smiski series, meet their characters, and find a little creature for every corner.",
};

export default function CatalogPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">THE COLLECTOR’S CORNER</p>
          <h1 className="page-title">A dictionary of little discoveries.</h1>
          <p className="muted mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
            Get to know the series, the characters, and all their curious little
            personalities.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-[#dce4d5] bg-white px-5 py-4 text-sm text-[#52664b]">
          <BookOpen size={22} aria-hidden="true" />
          <span>
            <strong className="block text-lg text-[#183d29]">
              {series.length} collections
            </strong>
            A little something for everyone
          </span>
        </div>
      </div>
      <CatalogBrowser entries={series} />
    </div>
  );
}
