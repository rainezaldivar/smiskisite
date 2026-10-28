"use client";

import { useEffect } from "react";

export function ImageProtection() {
  useEffect(() => {
    // Images ignore pointer events, so their immediate wrappers receive the event.
    const protect = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        target.closest("picture, img") ||
        target.querySelector(":scope > img") ||
        target.closest("a")?.querySelector("img")
      ) {
        event.preventDefault();
      }
    };
    document.addEventListener("contextmenu", protect);
    document.addEventListener("dragstart", protect);
    return () => {
      document.removeEventListener("contextmenu", protect);
      document.removeEventListener("dragstart", protect);
    };
  }, []);
  return null;
}
