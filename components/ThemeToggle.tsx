"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  if (!mounted) {
    return <span className={`h-9 w-9 ${className}`} aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/70 text-emerald transition-colors hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-cream dark:hover:bg-white/20 ${className}`}
    >
      <Icon name={isDark ? "sun" : "moon"} className="h-4 w-4" />
    </button>
  );
}
