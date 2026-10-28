import { CollectionCard } from "@/components/content/collection-card";
import { series } from "@/lib/series";

// Server rendered: scrolling, pagination, arrows and active styles are all CSS.
export function CollectionsCarousel() {
  const featured = series.filter((entry) =>
    ["birthday", "sunday", "moving", "work", "museum", "exercising"].includes(
      entry.id,
    ),
  );
  return (
    <section
      className="collections-section container-page home-section"
      aria-labelledby="collections-title"
    >
      <h2 id="collections-title" className="section-heading mb-6">
        Collections
      </h2>
      <p className="carousel-warning" role="note">
        Your browser does not support carousel controls. Scroll to explore the
        collections.
      </p>
      <div
        className="collections-carousel"
        role="region"
        aria-label="Collections"
        tabIndex={0}
      >
        {featured.map((entry, index) => (
          <div
            className={`profile-card${index === 0 ? " scroll-start" : ""}`}
            key={entry.id}
          >
            <CollectionCard entry={entry} />
          </div>
        ))}
      </div>
    </section>
  );
}
