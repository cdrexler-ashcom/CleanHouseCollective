"use client";

import { Icon } from "./Icon";
import { testimonials } from "@/data/site";

/**
 * Infinite, seamless marquee of short review highlights.
 *
 * Performance-first: it's a single CSS transform animation (no JS loop, no
 * layout thrashing), pauses on hover, and fully stops under
 * `prefers-reduced-motion`. The item list is duplicated once so a translateX
 * of -50% loops perfectly with no visible seam.
 */

// Pick punchy, short quotes that read well as pills.
const highlights = testimonials
  .filter((t) => t.quote.length <= 70)
  .map((t) => ({ quote: t.quote.replace(/[.!]+$/, ""), name: t.name }));

// Fallback in case the length filter is ever too strict.
const items = (highlights.length >= 6 ? highlights : testimonials).slice(0, 10);

function Pill({ quote, name }: { quote: string; name: string }) {
  return (
    <div className="mx-3 flex shrink-0 items-center gap-3 rounded-full border border-black/5 bg-white/80 px-5 py-3 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <span className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
          </svg>
        ))}
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-charcoal/80 dark:text-cream/80">
        &ldquo;{quote}&rdquo;
      </span>
      <span className="whitespace-nowrap text-xs font-semibold text-sage-dark dark:text-sage-light">
        — {name}
      </span>
    </div>
  );
}

export function Marquee({ durationSeconds = 45 }: { durationSeconds?: number }) {
  // Duplicate the list once for a seamless -50% loop.
  const doubled = [...items, ...items];

  return (
    <div className="relative py-6">
      <div className="marquee-mask overflow-hidden">
        <div
          className="marquee-track"
          style={{ ["--marquee-duration" as any]: `${durationSeconds}s` }}
        >
          {doubled.map((item, i) => (
            <Pill key={i} quote={item.quote} name={item.name} />
          ))}
        </div>
      </div>

      {/* Little label chip riding above the stream */}
      <div className="pointer-events-none absolute -top-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-emerald px-3 py-1 text-xs font-semibold text-cream shadow-soft sm:flex">
        <Icon name="sparkles" className="h-3.5 w-3.5" />
        Real client love
      </div>
    </div>
  );
}
