import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products";

const featured = [
  {
    id: "birthday",
    name: "Birthday",
    image: "birthday_yum.png",
    note: "A little celebration",
  },
  {
    id: "sunday",
    name: "Sunday",
    image: "sunday_guitar.png",
    note: "Taking it easy",
  },
  {
    id: "moving",
    name: "Moving",
    image: "moving_fall.png",
    note: "A helping little hand",
  },
  {
    id: "work",
    name: "Work",
    image: "work_approved.png",
    note: "Busy being curious",
  },
  {
    id: "museum",
    name: "Museum",
    image: "museum_pearl.png",
    note: "A work of little art",
  },
  {
    id: "exercising",
    name: "Exercising",
    image: "exercise_balance.png",
    note: "Finding their balance",
  },
];

const categoryImages: Record<string, string> = {
  figurines: "cheerdancing.png",
  straps: "strapv.3.png",
  touchlights: "touchlight2.1.png",
  plushies: "plush.2.png",
  stickers: "sticker_smiski.png",
  accessories: "strapacc3.png",
  keychains: "plushchain.png",
  others: "touchlight2.1.png",
};

function categoryLabel(value: string) {
  return value === "TouchLights" ? "Touch lights" : value;
}

export default async function HomePage() {
  const products = await getProducts();
  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  return (
    <div>
      <section
        className="container-page pb-10 pt-5 sm:pb-14 sm:pt-8"
        aria-labelledby="home-title"
      >
        <div className="relative grid overflow-hidden rounded-[2rem] bg-[#e8efce] lg:min-h-[510px] lg:grid-cols-2">
          <div className="relative z-10 px-7 pb-2 pt-10 sm:px-12 sm:pt-14 lg:py-16">
            <p className="eyebrow mb-5">SMALL DISCOVERIES, EVERY DAY</p>
            <h1
              id="home-title"
              className="max-w-xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] text-[#183d29] sm:text-6xl lg:text-[4.5rem]"
            >
              Small creatures.
              <br />
              Big personality.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#526347] sm:text-lg">
              A little curious. A little shy. Find a glowing companion for your
              favorite corner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="button-primary">
                Find your little glow{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/catalog"
                className="button-secondary border-[#b9c7a0] bg-transparent"
              >
                Explore collections
              </Link>
            </div>
            <p className="mt-8 flex items-center gap-2 text-xs font-medium tracking-wide text-[#5f714d]">
              <Sparkles size={15} aria-hidden="true" /> A little company for the
              everyday.
            </p>
          </div>
          <div className="relative flex min-h-72 items-center justify-center p-5 sm:min-h-96 lg:py-8">
            <div
              className="absolute h-64 w-64 rounded-full bg-[#f7f9ed] sm:h-80 sm:w-80 lg:h-96 lg:w-96"
              aria-hidden="true"
            />
            <img
              src="/uploads/cheerdancing.png"
              alt="Two glowing Smiski characters cheering with green pom-poms"
              fetchPriority="high"
              className="relative z-10 h-72 w-full max-w-md object-contain sm:h-[390px] lg:h-[460px]"
            />
            <div className="absolute bottom-6 right-6 z-10 rounded-full border border-[#d3debf] bg-[#f7f9ed] px-4 py-2 text-xs font-medium text-[#52664b] sm:bottom-10 sm:right-10">
              Little things, happy corners.
            </div>
          </div>
        </div>
      </section>

      <section
        className="container-page pb-14 sm:pb-20"
        aria-labelledby="featured-title"
      >
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">FIND YOUR KIND OF CURIOUS</p>
            <h2
              id="featured-title"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Meet the collections.
            </h2>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm font-semibold"
          >
            The collector’s dictionary{" "}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={`/catalog/${item.id}`}
              className="group rounded-3xl border border-[#e1e8db] bg-white p-3 pb-5 text-center transition-colors hover:border-[#91a672]"
            >
              <div className="mb-4 flex aspect-square items-center justify-center rounded-2xl bg-[#f1f4e8] p-3">
                <img
                  src={`/uploads/${item.image}`}
                  alt={`${item.name} Series Smiski`}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:-translate-y-1"
                />
              </div>
              <h3 className="text-sm font-semibold sm:text-base">
                {item.name} Series
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#728064]">
                {item.note}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section
          className="border-y border-[#e0e7d7] bg-[#edf2e3] py-12 sm:py-16"
          aria-labelledby="categories-title"
        >
          <div className="container-page">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">
                  A LITTLE SOMETHING FOR EVERY CORNER
                </p>
                <h2
                  id="categories-title"
                  className="text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  What catches your eye?
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold"
              >
                Shop everything <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div
              className={
                categories.length <= 2
                  ? "grid grid-cols-2 gap-4"
                  : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
              }
            >
              {categories.map((category) => {
                const key = category.toLowerCase().replace(/\s+/g, "");
                const image = categoryImages[key];
                return (
                  <Link
                    key={category}
                    href={`/shop?category=${encodeURIComponent(category)}`}
                    className="group flex min-h-44 flex-col items-center justify-between rounded-3xl border border-[#dde5d1] bg-[#f9faf4] p-5 transition-colors hover:border-[#91a672]"
                  >
                    {image ? (
                      <>
                        <img
                          src={`/uploads/${image}`}
                          alt=""
                          loading="lazy"
                          className="mb-4 h-32 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </>
                    ) : (
                      <Sparkles
                        size={48}
                        className="my-10 text-[#8fa96a]"
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex w-full items-center justify-between gap-2 text-sm font-semibold">
                      {categoryLabel(category)}
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section
        className="container-page py-14 sm:py-20"
        aria-labelledby="products-title"
      >
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">YOUR NEXT LITTLE DISCOVERY</p>
            <h2
              id="products-title"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Fresh from the corner.
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold"
          >
            View all products <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card py-12 text-center">
            <p className="muted">
              The shop is taking a little breather. Check back for new
              discoveries.
            </p>
            <Link href="/catalog" className="button-secondary mt-5">
              Explore the dictionary <BookOpen size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      <section
        className="container-page pb-14 sm:pb-20"
        aria-labelledby="about-preview-title"
      >
        <div className="grid overflow-hidden rounded-[2rem] border border-[#e0e6d7] bg-white md:grid-cols-2">
          <div className="flex min-h-64 items-center justify-center bg-[#f5ec20]">
            <img
              src="/uploads/about01.png"
              alt="Three Smiski hiding together in a bright yellow corner"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:p-14">
            <p className="eyebrow mb-4">HELLO, LITTLE ONE</p>
            <h2
              id="about-preview-title"
              className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
            >
              Good things hide
              <br />
              in little corners.
            </h2>
            <p className="muted mt-5 max-w-md leading-relaxed">
              Smiski are curious little creatures who like to stay out of sight.
              But wait until the lights go out—you might spot their gentle glow.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 font-semibold"
            >
              Get to know Smiski <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <span className="mt-8 inline-flex items-center gap-2 text-xs text-[#78856e]">
              <Heart size={14} aria-hidden="true" /> A little corner made by a
              fan.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
