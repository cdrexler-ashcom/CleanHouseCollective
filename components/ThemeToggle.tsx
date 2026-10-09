"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Icon } from "./Icon";
import {
  applyTheme,
  currentTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from "@/lib/theme";

function subscribe(onChange: () => void) {
  window.addEventListener("themechange", onChange);
  return () => window.removeEventListener("themechange", onChange);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Reads the `dark` class on <html>; the server snapshot is "light" and React
  // reconciles after hydration. The icon itself is chosen with CSS (below), so
  // the button never pops in or flips after load.
  const isDark = useSyncExternalStore(
    subscribe,
    () => currentTheme() === "dark",
    () => false
  );

  useEffect(() => {
    // Re-assert the right theme once the app is live (guards against anything
    // having reset the class during hydration).
    applyTheme(resolveTheme());

    // Follow the system theme, but only while the user has not chosen one.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      if (!readStoredTheme()) applyTheme(resolveTheme());
    };
    // Another tab changed the theme.
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") applyTheme(resolveTheme());
    };
    // Restored from the back/forward cache or a suspended mobile tab.
    const onShow = () => applyTheme(resolveTheme());
    const onVisible = () => {
      if (document.visibilityState === "visible") applyTheme(resolveTheme());
    };

    mq.addEventListener?.("change", onSystem);
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onShow);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      mq.removeEventListener?.("change", onSystem);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onShow);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      suppressHydrationWarning
      className={`flex h-9 w-9 touch-manipulation items-center justify-center rounded-full border border-black/5 bg-white/70 text-emerald transition-colors hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-cream dark:hover:bg-white/20 ${className}`}
    >
      <Icon name="moon" className="h-4 w-4 dark:hidden" />
      <Icon name="sun" className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
