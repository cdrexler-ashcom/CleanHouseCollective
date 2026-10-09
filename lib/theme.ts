/**
 * Theme helpers (light / dark).
 *
 * Source of truth is the `dark` class on <html>. The choice is persisted in
 * localStorage with a cookie as a fallback (some in-app and private browsers
 * block or clear localStorage). With no saved choice we follow the system.
 *
 * The matching pre-paint script lives in app/layout.tsx and must stay in sync
 * with `readStoredTheme` / `systemTheme` below.
 */

export type Theme = "light" | "dark";

const KEY = "theme";
const COOKIE_RE = /(?:^|; )theme=(dark|light)/;
const THEME_COLORS: Record<Theme, string> = {
  light: "#0D4F45",
  dark: "#0A3E37",
};

export function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    /* storage blocked: fall through to the cookie */
  }
  try {
    const m = document.cookie.match(COOKIE_RE);
    if (m) return m[1] as Theme;
  } catch {
    /* ignore */
  }
  return null;
}

export function systemTheme(): Theme {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? systemTheme();
}

export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Apply a theme to the page (no persistence). Safe to call repeatedly. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (currentTheme() === theme && root.style.colorScheme === theme) return;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", THEME_COLORS[theme]));
  window.dispatchEvent(new Event("themechange"));
}

/** Persist an explicit user choice. */
export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}
