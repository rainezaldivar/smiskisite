import type { Metadata } from "next";
import {
  AboutStoryCarousel,
  type AboutStory,
} from "@/components/content/about-story-carousel";

export const metadata: Metadata = {
  title: "About Smiski",
  description:
    "Meet the curious little creatures who love hiding in small spaces and glow when the lights go out.",
};

const stories: AboutStory[] = [
  {
    id: "curious",
    title: "A curious little creature.",
    text: "Smiski love hiding in small spaces and corners of your room. Look closely, and you might find a little friend where you least expect one.",
    image: "about01.png",
    alt: "Three Smiski in a yellow corner",
    background: "#fae80f",
    position: "center center",
    mobilePosition: "50% center",
  },
  {
    id: "hidden",
    title: "Shy, but never far away.",
    text: "Although they like to stay hidden, these little creatures have a way of making a space feel a little more special. A quiet shelf. A cozy desk. A corner all their own.",
    image: "about02.png",
    alt: "Smiski hiding quietly in their favorite spaces",
    background: "#56a204",
    position: "center center",
    mobilePosition: "14% center",
  },
  {
    id: "glow",
    title: "Wait until the lights go out.",
    text: "You might discover one at night as they mysteriously glow in the dark. It’s a small surprise that brings a little light to the everyday.",
    image: "about03.gif",
    alt: "Smiski showing their gentle glow in the dark",
    background: "#fae81e",
    position: "center center",
    mobilePosition: "50% center",
  },
  {
    id: "personalities",
    title: "Which little personality feels like you?",
    text: "From quiet moments to busy little adventures, there are many types of Smiski to meet. Explore the collections and get to know each character.",
    image: "about04.png",
    alt: "Smiski characters with different little personalities",
    background: "#eba014",
    position: "center center",
    mobilePosition: "50% center",
    eyebrow: "SAME LITTLE GLOW, DIFFERENT LITTLE WORLDS",
    actions: true,
  },
];

export default function AboutPage() {
  return (
    <div>
      <AboutStoryCarousel stories={stories} />
      <p className="container-page py-10 text-center text-sm leading-relaxed text-muted">
        Smiskisite is a fan-made student portfolio project, inspired by the joy
        of collecting. It is not affiliated with SMISKI or its creators.
      </p>
    </div>
  );
}
