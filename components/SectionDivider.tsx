"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./LogoMark";

/**
 * Animated section divider.
 *
 * A pair of gradient hairlines that "draw" outward from a centre emblem, which
 * pops in with a subtle spring, as the divider scrolls into view. Purely
 * transform/opacity based (cheap on mobile) and disabled under reduced motion
 * via the CSS in globals.css.
 *
 * `variant="wave"` renders a soft SVG wave that blends one section's background
 * into the next — nice between alternating-background sections.
 */
export function SectionDivider({
  variant = "emblem",
  className = "",
}: {
  variant?: "emblem" | "wave";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (variant === "wave") {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={`${visible ? "divider-visible" : ""} relative -mb-px w-full overflow-hidden ${className}`}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="h-12 w-full text-white/60 dark:text-white/[0.03] sm:h-16"
        >
          <path
            className="divider-line"
            style={{ transformOrigin: "center", transformBox: "view-box" }}
            fill="currentColor"
            d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${visible ? "divider-visible" : ""} container-page flex items-center justify-center gap-4 py-10 sm:py-14 ${className}`}
    >
      <span className="divider-line h-px w-full max-w-[10rem] bg-gradient-to-r from-transparent to-emerald/30 dark:to-sage/30" />
      <span className="divider-dot flex h-10 w-10 flex-none items-center justify-center rounded-full bg-cream p-2 text-emerald shadow-soft ring-1 ring-black/5 dark:bg-emerald-deep dark:text-sage-light">
        <LogoMark className="h-full w-full" />
      </span>
      <span className="divider-line h-px w-full max-w-[10rem] bg-gradient-to-l from-transparent to-emerald/30 dark:to-sage/30" />
    </div>
  );
}
