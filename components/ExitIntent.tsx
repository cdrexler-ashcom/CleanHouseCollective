"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useQuote } from "./QuoteProvider";

const STORAGE_KEY = "chc-exit-offer-seen";
// Don't fire for people who are just passing the cursor over the browser chrome
// in the first moments, or while the mop intro is still playing.
const MIN_TIME_ON_PAGE_MS = 4000;

/**
 * Desktop exit-intent popup: when a visitor's cursor leaves through the top of
 * the page (towards the tab bar / address bar / close button) we remind them
 * of the new client discount. Shown at most once per visitor, and never once
 * they have opened the quote form. Touch devices have no cursor to track, so
 * it does nothing there.
 */
export function ExitIntent() {
  const { open: openQuote, isOpen: quoteOpen } = useQuote();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Hover-capable pointer devices only (skips phones and tablets).
    if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* storage unavailable: fall through, still once per page load */
    }

    const loadedAt = Date.now();
    let fired = false;

    const onLeave = (e: MouseEvent) => {
      if (fired) return;
      // Left through the top edge with no element to land on.
      if (e.clientY > 0 || e.relatedTarget) return;
      if (Date.now() - loadedAt < MIN_TIME_ON_PAGE_MS) return;
      fired = true;
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setVisible(true);
    };

    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  // If they open the quote form themselves, they don't need the reminder.
  useEffect(() => {
    if (quoteOpen) setVisible(false);
  }, [quoteOpen]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="New client offer"
    >
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setVisible(false)}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-cream p-8 text-center shadow-soft-lg animate-scale-in dark:bg-emerald-deep">
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition hover:bg-charcoal/10 dark:text-cream/60 dark:hover:bg-white/10"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            &times;
          </span>
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 text-emerald dark:bg-white/10 dark:text-sage-light">
          <Icon name="tag" className="h-7 w-7" />
        </div>

        <h2 className="mt-5 font-display text-2xl font-bold text-charcoal dark:text-cream">
          Wait, before you go!
        </h2>
        <p className="mt-3 text-charcoal/70 dark:text-cream/70">
          New clients get <strong>$20 off their first clean</strong>. Tell us
          about your home and we&apos;ll send a flat-rate quote, no obligation.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              openQuote();
            }}
            className="btn-primary sheen justify-center"
          >
            Claim my $20 off
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="text-sm font-medium text-charcoal/60 hover:text-charcoal dark:text-cream/60 dark:hover:text-cream"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
