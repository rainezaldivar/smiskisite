"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const storageKey = "smiskisite:theme";
const changeEvent = "smiskisite:theme-change";

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(storageKey);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(listener: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const syncPreference = () => {
    document.documentElement.dataset.theme =
      savedTheme() ?? (media.matches ? "dark" : "light");
    listener();
  };
  window.addEventListener("storage", syncPreference);
  window.addEventListener(changeEvent, listener);
  media.addEventListener("change", syncPreference);
  return () => {
    window.removeEventListener("storage", syncPreference);
    window.removeEventListener(changeEvent, listener);
    media.removeEventListener("change", syncPreference);
  };
}

export function ThemeToggle({ menu = false }: { menu?: boolean }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light");
  const next = theme === "dark" ? "light" : "dark";
  const title = `Turn night mode ${next === "dark" ? "on" : "off"}`;

  function toggle() {
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // The switch still works for this visit if storage is unavailable.
    }
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new Event(changeEvent));
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${menu ? "w-full justify-start border-0 px-3" : "justify-center px-2"}`}
      role="switch"
      aria-label="Night mode"
      aria-checked={theme === "dark"}
      title={title}
      onClick={toggle}
    >
      {theme === "dark" ? (
        <Sun size={19} aria-hidden="true" />
      ) : (
        <Moon size={19} aria-hidden="true" />
      )}
      <span className={menu ? "inline" : "hidden min-[1280px]:inline"}>
        Night mode
      </span>
    </button>
  );
}
