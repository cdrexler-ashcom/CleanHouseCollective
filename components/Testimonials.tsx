"use client";

import { useState } from "react";
import { testimonials } from "@/data/site";
import { Icon } from "./Icon";
import { Marquee } from "./Marquee";

const PREVIEW_COUNT = 3;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Review({
  quote,
  name,
  service,
  timeAgo,
  rating,
}: (typeof testimonials)[number]) {
  return (
    <figure className="card break-inside-avoid">
      <Stars count={rating} />
      <blockquote className="mt-4 text-charcoal/80 dark:text-cream/80">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 border-t border-black/5 pt-4 dark:border-white/10">
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-charcoal/60 dark:text-cream/60">
          {service} · {timeAgo}
        </p>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const [expanded, setExpanded] = useState(false);
  const hasMore = testimonials.length > PREVIEW_COUNT;

  const preview = testimonials.slice(0, PREVIEW_COUNT);
  const rest = testimonials.slice(PREVIEW_COUNT);

  return (
    <section id="testimonials" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Client Reviews</p>
          <h2 className="heading-lg mt-3">18 five-star reviews &amp; counting</h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="text-sm font-medium text-charcoal/60 dark:text-cream/60">
              Verified Airtasker feedback
            </span>
          </div>
        </div>

      </div>

      {/* Full-bleed marquee of review highlights */}
      <div className="mt-12">
        <Marquee />
      </div>

      <div className="container-page">
        {/* Always-visible preview (first three) */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((t) => (
            <Review key={t.name} {...t} />
          ))}
        </div>

        {/* Expandable remainder */}
        {hasMore && (
          <div className="relative">
            {/* Collapsible region */}
            <div
              className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
                expanded
                  ? "mt-6 grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!expanded}
            >
              <div className="min-h-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((t) => (
                    <Review key={t.name} {...t} />
                  ))}
                </div>
              </div>
            </div>

            {/* Fade overlay (only while collapsed) sits over the preview's
                bottom edge to signal there's more to reveal. */}
            {!expanded && (
              <div className="pointer-events-none absolute inset-x-0 -top-28 h-28 bg-gradient-to-b from-transparent to-cream dark:to-emerald-deep" />
            )}

            {/* Toggle button */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="btn-secondary"
              >
                {expanded
                  ? "Show fewer reviews"
                  : `Show all ${testimonials.length} reviews`}
                <Icon
                  name="chevronDown"
                  className={`h-4 w-4 transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
