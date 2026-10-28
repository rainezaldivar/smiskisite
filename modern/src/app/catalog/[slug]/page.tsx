import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { series } from "@/lib/series";
import { imageUrl } from "@/lib/utils";
import { hasSecretCharacter } from "@/lib/product-filters";
import { CollectionCard } from "@/components/content/collection-card";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return series.map((entry) => ({ slug: entry.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = series.find((item) => item.id === slug);
  return {
    title: entry?.name ?? "Collection not found",
    description: entry?.description,
  };
}
export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const entry = series.find((item) => item.id === slug);
  if (!entry) notFound();
  const related = series
    .filter((item) => item.group === entry.group && item.id !== entry.id)
    .slice(0, 4);
  return (
    <div className="container-page py-8 sm:py-12">
      <Link
        href="/catalog"
        className="mb-8 inline-flex items-center gap-2 font-medium text-[#52664b]"
      >
        <ArrowLeft size={18} aria-hidden="true" /> Collections
      </Link>
      <section className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="collection-hero-image flex aspect-square max-h-[520px] items-center justify-center p-6">
          <img
            src={imageUrl(entry.image)}
            alt={entry.name}
            draggable={false}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="py-4">
          <h1 className="page-title">{entry.name}</h1>
          {entry.katakana && (
            <p lang="ja" className="muted mt-4 text-xl tracking-widest">
              {entry.katakana}
            </p>
          )}
          {entry.description && (
            <p className="muted mt-6 max-w-lg text-lg leading-relaxed">
              {entry.description}
            </p>
          )}
        </div>
      </section>
      {entry.variations.length > 0 && (
        <section className="mt-12 sm:mt-16" aria-labelledby="characters-title">
          <h2 id="characters-title" className="section-heading">
            Meet the Little Characters
          </h2>
          <div className="character-grid mt-8">
            {entry.variations.map((variation, index) => (
              <article
                key={`${variation.name}-${index}`}
                className="character-card"
              >
                <div className="character-image">
                  {variation.image && (
                    <img
                      src={imageUrl(variation.image)}
                      alt={variation.name}
                      draggable={false}
                      loading="lazy"
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold">{variation.name}</h3>
                {variation.description && (
                  <p className="muted mt-2 leading-relaxed">
                    {variation.description}
                  </p>
                )}
              </article>
            ))}
            {hasSecretCharacter(entry) && (
              <article
                className="character-card secret-character"
                aria-label="Secret character"
              >
                <div
                  className="character-image secret-image"
                  role="img"
                  aria-label="Secret character silhouette"
                >
                  {/* Add secretImage to the series when its artwork is supplied. */}
                  {entry.secretImage ? (
                    <img
                      src={imageUrl(entry.secretImage)}
                      alt=""
                      draggable={false}
                      loading="lazy"
                      className="secret-artwork"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 200 240"
                      aria-hidden="true"
                      className="secret-silhouette"
                    >
                      <path
                        d="M100 15c-29 0-49 20-49 46 0 20 10 37 24 44l-19 20-24 27c-9 11 5 25 15 17l19-17-2 39-13 26c-6 14 13 23 21 11l21-31h14l21 31c8 12 27 3 21-11l-13-26-2-39 19 17c10 8 24-6 15-17l-24-27-19-20c14-7 24-24 24-44 0-26-20-46-49-46Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  <span className="secret-question" aria-hidden="true">
                    ?
                  </span>
                </div>
              </article>
            )}
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section
          className="mt-12 border-t border-[#dce4d5] pt-10 sm:mt-16"
          aria-labelledby="more-series-title"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 id="more-series-title" className="section-heading">
              Keep exploring
            </h2>
            <Link href="/catalog" className="font-medium">
              All collections
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {related.map((item) => (
              <CollectionCard key={item.id} entry={item} />
            ))}
          </div>
        </section>
      )}
      <div className="mt-12 flex justify-center border-t border-[#dce4d5] pt-10">
        <Link
          href={`/shop?series=${encodeURIComponent(entry.id)}`}
          className="button-primary"
        >
          Explore the Shop
        </Link>
      </div>
    </div>
  );
}
