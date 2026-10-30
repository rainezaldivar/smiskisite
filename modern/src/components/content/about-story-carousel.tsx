"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

export type AboutStory = {
  id: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  background: string;
  position: string;
  mobilePosition: string;
  eyebrow?: string;
  actions?: boolean;
};

export function AboutStoryCarousel({ stories }: { stories: AboutStory[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function show(index: number) {
    const next = Math.max(0, Math.min(stories.length - 1, index));
    const viewport = track.current;
    if (!viewport) return;
    setActive(next);
    viewport.scrollTo({
      left: next * viewport.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  function syncActive() {
    const viewport = track.current;
    if (!viewport) return;
    setActive(Math.round(viewport.scrollLeft / viewport.clientWidth));
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      show(active + (event.key === "ArrowRight" ? 1 : -1));
    }
  }

  return (
    <div
      className="about-story-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="About SMISKI stories"
    >
      <div
        ref={track}
        className="about-story-track"
        tabIndex={0}
        aria-label="Smiski stories; use arrow keys to move between them"
        onKeyDown={handleKeys}
        onScroll={syncActive}
      >
        {stories.map((story, index) => {
          const Heading = index === 0 ? "h1" : "h2";
          const style = {
            "--story-color": story.background,
            "--story-position": story.position,
            "--story-position-mobile": story.mobilePosition,
          } as CSSProperties;
          return (
            <section
              key={story.id}
              className={`about-story-panel${story.actions ? " about-story-finale" : ""}`}
              style={style}
              aria-labelledby={`story-${story.id}`}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${stories.length}: ${story.title}`}
            >
              <img
                className="about-story-image"
                src={`/uploads/${story.image}`}
                alt={story.alt}
                draggable={false}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="about-story-shade" aria-hidden="true" />
              <div className="about-story-copy container-page">
                {story.eyebrow && <p className="eyebrow">{story.eyebrow}</p>}
                <Heading id={`story-${story.id}`}>{story.title}</Heading>
                <p>{story.text}</p>
                {story.actions && (
                  <div className="about-story-actions">
                    <Link href="/catalog" className="about-story-action">
                      Meet the collections{" "}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <Link href="/shop" className="about-story-action">
                      Explore the shop
                    </Link>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <button
        type="button"
        className="about-story-arrow about-story-previous"
        aria-label="Previous story"
        disabled={active === 0}
        onClick={() => show(active - 1)}
      >
        <ChevronLeft size={24} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="about-story-arrow about-story-next"
        aria-label="Next story"
        disabled={active === stories.length - 1}
        onClick={() => show(active + 1)}
      >
        <ChevronRight size={24} aria-hidden="true" />
      </button>
      <div
        className="about-story-dots"
        role="group"
        aria-label="Choose a story"
      >
        {stories.map((story, index) => (
          <button
            key={story.id}
            type="button"
            aria-label={`Show ${story.title}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => show(index)}
          />
        ))}
      </div>
    </div>
  );
}
