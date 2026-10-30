import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { CollectionsCarousel } from "@/components/content/collections-carousel";
import { getProducts } from "@/lib/products";
import { getNews } from "@/lib/news";

export default function HomePage() {
  const news = getNews();
  return (
    <div>
      <section
        className="container-page home-section news-section"
        aria-labelledby="news-title"
      >
        <h1 id="news-title" className="sr-only">
          Latest News
        </h1>
        <div
          className="news-carousel"
          role="region"
          aria-label="Latest News"
          tabIndex={0}
        >
          {news.map((item, index) => (
            <article
              className={`news-slide${index === 0 ? " scroll-start" : ""}`}
              key={item.id}
            >
              <a href={item.href}>
                <div className="news-image">
                  <img
                    src={item.image}
                    alt="SMISKI"
                    draggable={false}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                </div>
                <div className="news-copy">
                  <time dateTime={item.publishedAt}>
                    {new Intl.DateTimeFormat("en", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(item.publishedAt))}
                  </time>
                  <h2 className="section-heading">{item.title}</h2>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
      <section
        className="container-page home-section"
        aria-labelledby="about-preview-title"
      >
        <div className="about-preview">
          <img
            src="/uploads/about01.png"
            alt="Three Smiski hiding together in a bright yellow corner"
            draggable={false}
            loading="lazy"
          />
          <div>
            <h2 id="about-preview-title" className="section-heading">
              About SMISKI
            </h2>
            <p className="muted mt-5 leading-relaxed">
              Smiski are curious little creatures who like to stay out of sight.
              But wait until the lights go out—you might spot their gentle glow.
            </p>
            <Link href="/about" className="button-secondary mt-6">
              About SMISKI
            </Link>
          </div>
        </div>
      </section>
      <section
        className="container-page home-section"
        aria-labelledby="products-title"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="products-title" className="section-heading heading-inhabitant">
            Shop
            <img src="/uploads/profile.png" alt="" aria-hidden="true" draggable={false} loading="lazy" />
          </h2>
          <Link href="/shop" className="font-semibold">
            View all products
          </Link>
        </div>
        <Suspense fallback={<div className="min-h-40" aria-busy="true" />}>
          <HomeShop />
        </Suspense>
      </section>
      <CollectionsCarousel />
    </div>
  );
}

async function HomeShop() {
  const products = await getProducts();
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
