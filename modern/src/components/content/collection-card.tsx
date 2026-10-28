import Link from "next/link";
import type { Series } from "@/lib/types";
import { imageUrl } from "@/lib/utils";

export function CollectionCard({
  entry,
  heading = "h3",
}: {
  entry: Series;
  heading?: "h2" | "h3";
}) {
  const Heading = heading;
  return (
    <article className="store-card">
      <Link href={`/catalog/${entry.id}`}>
        <div className="store-card-image">
          <img
            src={imageUrl(entry.image)}
            alt={entry.name}
            draggable={false}
            loading="lazy"
          />
        </div>
        <div className="store-card-copy">
          <Heading>{entry.name}</Heading>
        </div>
      </Link>
    </article>
  );
}
