"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useQuote } from "./QuoteProvider";

/**
 * Floating quote button + back-to-top, shown once the visitor has scrolled
 * past the hero. Keeps the main call to action one tap away on long pages.
 */
export function FloatingActions() {
  const { open, isOpen } = useQuote();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = show && !isOpen;

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)] transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href="#top"
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/90 text-emerald shadow-soft backdrop-blur transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-emerald-deep/90 dark:text-sage-light"
      >
        <Icon name="chevronDown" className="h-5 w-5 rotate-180" />
      </a>
      <button
        type="button"
        onClick={open}
        tabIndex={visible ? 0 : -1}
        className="btn-primary sheen !px-6 shadow-soft-lg"
      >
        Get a Quote
        <Icon name="arrowRight" className="h-4 w-4" />
      </button>
    </div>
  );
}
