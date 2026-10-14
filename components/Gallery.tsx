"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gallery } from "@/data/site";
import { Icon } from "./Icon";
import { useQuote } from "./QuoteProvider";

const PREVIEW_COUNT = 6;

type Item = (typeof gallery)[number];
type Kind = "before" | "after";

const src = (item: Item, kind: Kind, thumb = false) =>
  `/gallery/${item.id}-${kind}${thumb ? "-thumb" : ""}.jpg`;

const chip =
  "absolute top-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm";

/** Grid card: before and after side by side, using small thumbnails. */
function Pair({ item }: { item: Item }) {
  return (
    <div className="grid grid-cols-2 gap-0.5">
      {(["before", "after"] as const).map((kind) => (
        <div
          key={kind}
          className="relative aspect-[4/5] overflow-hidden bg-charcoal/10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src(item, kind, true)}
            alt={`${item.caption}, ${kind} cleaning`}
            width={480}
            height={600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={`${chip} left-2 ${
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

/**
 * One full-size photo. The small thumbnail (already cached from the grid) sits
 * underneath so there is never a blank frame while the large file loads.
 */
function Layer({ item, kind }: { item: Item; kind: Kind }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(item, kind, true)}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(item, kind)}
        alt={`${item.caption}, ${kind} cleaning`}
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

/** Large single photo with a draggable before/after divider. */
function Compare({ item }: { item: Item }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="relative aspect-[4/5] w-full max-w-[min(100%,calc(64vh*0.8))] touch-none select-none overflow-hidden rounded-2xl bg-charcoal/20 shadow-soft-lg"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Layer item={item} kind="before" />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <Layer item={item} kind="after" />
      </div>

      <span className={`${chip} left-2 bg-charcoal/70`}>Before</span>
      <span className={`${chip} right-2 bg-emerald/90`}>After</span>

      {/* Divider line and grab handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Reveal before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            e.stopPropagation(); // don't also switch photos
            setPos((p) =>
              Math.min(100, Math.max(0, p + (e.key === "ArrowRight" ? 5 : -5)))
            );
          }
        }}
        className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-emerald shadow-soft-lg outline-none ring-emerald/40 focus-visible:ring-4"
        style={{ left: `${pos}%` }}
      >
        <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
        <Icon name="arrowRight" className="h-4 w-4" />
      </div>
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

  // Warm the cache with the neighbouring pairs so stepping is instant.
  useEffect(() => {
    [1, -1].forEach((d) => {
      const n = gallery[(index + d + gallery.length) % gallery.length];
      (["before", "after"] as const).forEach((k) => {
        new Image().src = src(n, k);
      });
    });
  }, [index]);

  const navBtn =
    "flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30";

  // Portalled to <body>: the section sits inside a transformed scroll-reveal
  // wrapper, which would otherwise make `fixed` relative to it, not the screen.
  return createPortal(
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
      <div className="relative flex max-h-full w-full max-w-3xl flex-col items-center gap-3 animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className={`${navBtn} absolute right-2 top-2 z-10 bg-charcoal/60`}
        >
          <Icon name="close" className="h-5 w-5" />
        </button>

        {/* key: reset the slider and image fade for each new pair */}
        <Compare key={item.id} item={item} />

        <p className="text-xs text-white/60">Drag to compare before and after</p>

        <div className="flex w-full max-w-[min(100%,calc(64vh*0.8))] items-center justify-between gap-3">
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
    </div>,
    document.body
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
