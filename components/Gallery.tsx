"use client";

import { useCallback, useEffect, useState } from "react";
import { gallery } from "@/data/site";
import { Icon } from "./Icon";
import { useQuote } from "./QuoteProvider";

const PREVIEW_COUNT = 6;

type Item = (typeof gallery)[number];

function Pair({ item, large = false }: { item: Item; large?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-0.5">
      {(["before", "after"] as const).map((kind) => (
        <div
          key={kind}
          className="relative aspect-[4/5] overflow-hidden bg-charcoal/10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/gallery/${item.id}-${kind}.jpg`}
            alt={`${item.caption}, ${kind} cleaning`}
            width={900}
            height={1125}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover ${
              large
                ? ""
                : "transition-transform duration-500 group-hover:scale-105"
            }`}
          />
          <span
            className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm ${
              kind === "after" ? "bg-emerald/90" : "bg-charcoal/70"
            }`}
          >
            {kind}
          </span>
        </div>
      ))}
    </div>
  );
}

function Lightbox({
  index,
  onClose,
  onStep,
}: {
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const { open: openQuote } = useQuote();
  const item = gallery[index];

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onStep]);

  const navBtn =
    "flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Before and after photos"
    >
      <div
        className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative flex max-h-full w-full max-w-3xl flex-col items-center gap-4 animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className={`${navBtn} absolute right-2 top-2 z-10 bg-charcoal/60`}
        >
          <Icon name="close" className="h-5 w-5" />
        </button>

        {/* Limit the height so both photos fit on screen; the pair keeps its
            4:5 shape and is centred. */}
        <div className="w-full max-w-[min(100%,calc(62vh*1.6))] overflow-hidden rounded-2xl shadow-soft-lg">
          <Pair item={item} large />
        </div>

        <div className="flex w-full items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Previous photos"
            className={navBtn}
          >
            <Icon name="arrowRight" className="h-5 w-5 rotate-180" />
          </button>
          <div className="text-center text-white">
            <p className="font-display text-lg font-semibold">{item.caption}</p>
            <p className="text-sm text-white/60">
              {index + 1} / {gallery.length}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Next photos"
            className={navBtn}
          >
            <Icon name="arrowRight" className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            openQuote();
          }}
          className="btn-primary sheen"
        >
          Get a Free Quote
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const visible = expanded ? gallery : gallery.slice(0, PREVIEW_COUNT);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((i) =>
        i === null ? i : (i + dir + gallery.length) % gallery.length
      ),
    []
  );

  return (
    <section id="gallery" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our Work</p>
          <h2 className="heading-lg mt-3">Real homes, real results</h2>
          <p className="mt-4 text-charcoal/70 dark:text-cream/70">
            Before and after photos from real homes, taken on the day with no
            filters. Tap any pair to see it bigger.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View ${item.caption} before and after`}
              className="group card overflow-hidden !p-0 text-left"
            >
              <Pair item={item} />
              <p className="px-5 py-3 text-sm font-semibold">{item.caption}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="btn-secondary"
          >
            {expanded
              ? "Show fewer photos"
              : `See all ${gallery.length} transformations`}
            <Icon
              name="chevronDown"
              className={`h-4 w-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {active !== null && (
        <Lightbox index={active} onClose={close} onStep={step} />
      )}
    </section>
  );
}
