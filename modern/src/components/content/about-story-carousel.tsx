"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

const STORY_DURATION = 4000;
const GLOW_DURATION = 5840;
const GLOW_YELLOW_DURATION = 2490;

export type AboutStory = {
  id: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  background: string;
  eyebrow?: string;
  actions?: boolean;
};

export function AboutStoryCarousel({ stories }: { stories: AboutStory[] }) {
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement[]>([]);
  const glowPanel = useRef<HTMLElement>(null);
  const pendingTarget = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  const show = useCallback(
    (index: number) => {
      const next = (index + stories.length) % stories.length;
      const viewport = track.current;
      if (!viewport) return;
      pendingTarget.current = next;
      setActive(next);
      setCycle((value) => value + 1);
      viewport.scrollTo({
        left: next * viewport.clientWidth,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [stories.length],
  );

  useEffect(() => {
    const duration = active === 2 ? GLOW_DURATION : STORY_DURATION;
    const indicator = progress.current[active];
    progress.current.forEach((dot) =>
      dot?.style.setProperty("--story-progress", "0%"),
    );
    glowPanel.current?.removeAttribute("data-night");
    if (!indicator) return;

    let frame = 0;
    let started = 0;
    let night = false;
    const advance = (now: number) => {
      if (!started) started = now;
      const elapsed = Math.min(now - started, duration);
      indicator.style.setProperty(
        "--story-progress",
        `${(elapsed / duration) * 100}%`,
      );
      if (active === 2 && !night && elapsed >= GLOW_YELLOW_DURATION) {
        glowPanel.current?.setAttribute("data-night", "true");
        night = true;
      }
      if (elapsed >= duration) {
        show(active + 1);
        return;
      }
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [active, cycle, show]);

  function syncActive() {
    const viewport = track.current;
    if (!viewport) return;
    const next = Math.round(viewport.scrollLeft / viewport.clientWidth);
    if (pendingTarget.current !== null) {
      if (
        Math.abs(
          viewport.scrollLeft - pendingTarget.current * viewport.clientWidth,
        ) < 2
      ) {
        pendingTarget.current = null;
      }
      return;
    }
    if (next !== active) {
      setActive(next);
      setCycle((value) => value + 1);
    }
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
        onPointerDown={() => {
          pendingTarget.current = null;
        }}
        onWheel={() => {
          pendingTarget.current = null;
        }}
      >
        {stories.map((story, index) => {
          const Heading = index === 0 ? "h1" : "h2";
          const style = {
            "--story-color": story.background,
          } as CSSProperties;
          return (
            <section
              key={story.id}
              className={`about-story-panel${story.actions ? " about-story-finale" : ""}`}
              style={style}
              data-active={active === index ? "true" : undefined}
              ref={index === 2 ? glowPanel : undefined}
              aria-labelledby={`story-${story.id}`}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${stories.length}: ${story.title}`}
            >
              <div className="about-story-visual">
                <img
                  key={
                    index === 2 ? (active === 2 ? cycle : "inactive") : story.id
                  }
                  className="about-story-image"
                  src={`/uploads/${story.image}`}
                  alt={story.alt}
                  draggable={false}
                  loading={index === 0 || index === 2 ? "eager" : "lazy"}
                />
              </div>
              <div className="about-story-shade" aria-hidden="true" />
              <div className="about-story-copy container-page">
                {story.eyebrow && <p className="eyebrow">{story.eyebrow}</p>}
                <Heading id={`story-${story.id}`}>{story.title}</Heading>
                <p className="about-story-description">{story.text}</p>
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
        onClick={() => show(active - 1)}
      >
        <ChevronLeft size={24} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="about-story-arrow about-story-next"
        aria-label="Next story"
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
          >
            <span
              className="about-story-progress"
              ref={(node) => {
                if (node) progress.current[index] = node;
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
