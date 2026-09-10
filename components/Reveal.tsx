"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "left" | "right" | "scale";

/**
 * Scroll-reveal wrapper.
 *
 * Uses a single IntersectionObserver per element to add `.is-visible` when the
 * element scrolls into view, triggering the CSS transition defined in
 * globals.css. Reveals run once (then unobserve) for performance, and the CSS
 * automatically disables the effect under `prefers-reduced-motion`.
 *
 * Two modes:
 *  - Default: the wrapper itself reveals.
 *  - `stagger` set: the wrapper becomes a "group" whose direct children each
 *    reveal in sequence (incremental delay) once the group enters view — great
 *    for grids and lists.
 */
export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  stagger,
  className = "",
  amount = 0.15,
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  direction?: Direction;
  delay?: number;
  /** ms between each direct child's reveal (enables staggered children) */
  stagger?: number;
  className?: string;
  /** 0–1 visibility threshold before revealing */
  amount?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  const grouping = stagger != null;

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSeen(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [seen, amount]);

  const revealValue = direction === "up" ? "true" : direction;
  const Comp = Tag as any;

  if (grouping) {
    return (
      <Comp
        ref={ref as any}
        className={`reveal-group ${seen ? "is-visible" : ""} ${className}`}
      >
        {(Array.isArray(children) ? children : [children]).map((child, i) => (
          <div
            key={i}
            data-reveal="true"
            style={{ ["--reveal-delay" as any]: `${i * (stagger as number)}ms` }}
          >
            {child}
          </div>
        ))}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref as any}
      data-reveal={revealValue}
      className={`${seen ? "is-visible" : ""} ${className}`}
      style={{ ["--reveal-delay" as any]: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}
