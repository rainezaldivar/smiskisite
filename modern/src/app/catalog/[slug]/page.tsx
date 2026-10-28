import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Box, Sparkles } from "lucide-react";
import { series } from "@/lib/series";
import { imageUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return series.map((entry) => ({ slug: entry.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = series.find((item) => item.id === slug);
  return {
    title: entry?.name ?? "Collection not found",
    description:
      entry?.description || "Explore the Smiskisite collector’s dictionary.",
  };
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const entry = series.find((item) => item.id === slug);
  if (!entry) notFound();
  const related = series
    .filter((item) => item.group === entry.group && item.id !== entry.id)
    .slice(0, 4);
  const label =
    entry.group === "figurines"
      ? "Figurines"
      : entry.group === "accessories"
        ? "Accessories"
        : "Lifestyle & home";

  return (
    <div className="container-page py-8 sm:py-12">
      <Link
        href="/catalog"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#52664b] hover:text-[#183d29]"
      >
        <ArrowLeft size={17} aria-hidden="true" /> Back to the dictionary
      </Link>
      <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-[2rem] bg-[#e9efdd] p-8 sm:min-h-96 sm:p-12">
          <img
            src={imageUrl(entry.coverImage || entry.image)}
            alt={entry.name}
            className="max-h-[420px] w-full object-contain"
          />
        </div>
        <div className="py-4">
          <p className="eyebrow mb-4">{label} / COLLECTOR’S DICTIONARY</p>
          <h1 className="page-title">{entry.name}</h1>
          {entry.katakana && (
            <p
              lang="ja"
              className="mt-4 text-lg tracking-widest text-[#6d815a]"
            >
              {entry.katakana}
            </p>
          )}
          {entry.description && (
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#5b6c54]">
              {entry.description}
            </p>
          )}
          <div className="my-8 flex items-center gap-3 border-y border-[#dce4d5] py-5 text-sm text-[#52664b]">
            <Box size={22} aria-hidden="true" />
            <span>
              {entry.variations.length
                ? `${entry.variations.length} characters to get to know`
                : "A small discovery for your everyday life"}
            </span>
          </div>
          <Link href="/shop" className="button-primary">
            Explore the shop <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {entry.variations.length > 0 && (
        <section className="mt-16 sm:mt-20" aria-labelledby="characters-title">
          <p className="eyebrow mb-3">MEET THE LITTLE CHARACTERS</p>
          <h2
            id="characters-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Every pose has a personality.
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
            {entry.variations.map((variation, index) => (
              <article
                key={`${variation.name}-${index}`}
                className="overflow-hidden rounded-3xl border border-[#e1e8db] bg-white p-4 sm:p-6"
              >
                {variation.image ? (
                  <div className="mb-5 flex aspect-square items-center justify-center rounded-2xl bg-[#f2f5ec] p-5">
                    <img
                      src={imageUrl(variation.image)}
                      alt={variation.name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-5 flex h-20 items-center gap-3 text-[#9aaa7c]">
                    <Sparkles size={26} aria-hidden="true" />
                    <span className="text-sm font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
                <h3 className="text-base font-semibold sm:text-lg">
                  {variation.name}
                </h3>
                {variation.description && (
                  <p className="muted mt-2 text-sm leading-relaxed">
                    {variation.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section
          className="mt-16 border-t border-[#dce4d5] pt-12 sm:mt-20"
          aria-labelledby="more-series-title"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2
              id="more-series-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Keep exploring
            </h2>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-sm font-medium"
            >
              All collections <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {related.map((item) => (
              <Link
                href={`/catalog/${item.id}`}
                key={item.id}
                className="group rounded-3xl border border-[#e1e8db] bg-white p-4 transition-colors hover:border-[#99ae7e]"
              >
                <div className="mb-4 aspect-square rounded-2xl bg-[#f1f4e9] p-4">
                  <img
                    src={imageUrl(item.image)}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-semibold sm:text-base">
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
