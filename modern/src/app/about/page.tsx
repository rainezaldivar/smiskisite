import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Moon, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Smiski",
  description:
    "Meet the curious little creatures who love hiding in small spaces and glow when the lights go out.",
};

const story = [
  {
    number: "01",
    title: "A curious little creature.",
    text: "Smiski love hiding in small spaces and corners of your room. Look closely, and you might find a little friend where you least expect one.",
    image: "about01.png",
    alt: "Three Smiski in a yellow corner",
    background: "#f6ed25",
    icon: Heart,
  },
  {
    number: "02",
    title: "Shy, but never far away.",
    text: "Although they like to stay hidden, these little creatures have a way of making a space feel a little more special. A quiet shelf. A cozy desk. A corner all their own.",
    image: "about02.png",
    alt: "Smiski hiding quietly in their favorite spaces",
    background: "#e6efce",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Wait until the lights go out.",
    text: "You might discover one at night as they mysteriously glow in the dark. It’s a small surprise that brings a little light to the everyday.",
    image: "about03.gif",
    alt: "Smiski showing their gentle glow in the dark",
    background: "#183d29",
    icon: Moon,
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <p className="eyebrow mb-4">A LITTLE INTRODUCTION</p>
        <h1 className="page-title">Hello from the corner.</h1>
        <p className="muted mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
          Meet Smiski: curious little creatures with a gentle glow and a
          personality in every pose.
        </p>
      </header>
      <div className="space-y-8 sm:space-y-12">
        {story.map((chapter, index) => {
          const Icon = chapter.icon;
          return (
            <section
              key={chapter.number}
              className="grid overflow-hidden rounded-sm border border-[#e0e7d8] bg-white md:min-h-80 md:grid-cols-2"
              aria-labelledby={`story-${chapter.number}`}
            >
              <div
                className={`flex min-h-56 items-center justify-center overflow-hidden ${index % 2 === 1 ? "md:order-2" : ""}`}
                style={{ backgroundColor: chapter.background }}
              >
                <img
                  draggable={false}
                  src={`/uploads/${chapter.image}`}
                  alt={chapter.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                <div className="mb-6 flex items-center gap-3 text-[#7b925f]">
                  <span className="text-xs font-semibold tracking-[0.2em]">
                    {chapter.number} / THE STORY
                  </span>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <h2
                  id={`story-${chapter.number}`}
                  className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
                >
                  {chapter.title}
                </h2>
                <p className="mt-5 leading-relaxed text-[#5b6c54]">
                  {chapter.text}
                </p>
              </div>
            </section>
          );
        })}
      </div>
      <section
        className="mt-12 grid items-center gap-6 rounded-sm bg-[#e9efdb] p-7 sm:mt-16 sm:p-10 md:grid-cols-[1fr_250px] lg:p-14"
        aria-labelledby="personalities-title"
      >
        <div>
          <p className="eyebrow mb-4">
            SAME LITTLE GLOW, DIFFERENT LITTLE WORLDS
          </p>
          <h2
            id="personalities-title"
            className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
          >
            Which little personality
            <br />
            feels like you?
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-[#5b6c54]">
            From quiet moments to busy little adventures, there are many types
            of Smiski to meet. Explore the collections and get to know each
            character.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/catalog" className="button-primary">
              Meet the collections <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/shop" className="button-secondary">
              Explore the shop
            </Link>
          </div>
        </div>
        <img
          draggable={false}
          src="/uploads/about04.png"
          alt="Smiski characters with different little personalities"
          loading="lazy"
          className="mx-auto max-h-64 w-full max-w-sm rounded-sm object-contain"
        />
      </section>
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-[#73806a]">
        Smiskisite is a fan-made student portfolio project, inspired by the joy
        of collecting. It is not affiliated with SMISKI or its creators.
      </p>
    </div>
  );
}
