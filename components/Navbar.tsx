"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { useQuote } from "./QuoteProvider";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Service Area", href: "#service-area" },
  { label: "Reviews", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { open } = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/5 bg-cream/85 backdrop-blur-md dark:border-white/10 dark:bg-emerald-deep/85"
          : "bg-transparent"
      }`}
    >
      <nav className="container-page flex h-20 items-center justify-between">
        <a href="#top" aria-label="Clean House Collective home">
          <Logo showText={false} />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal/80 transition-colors hover:text-emerald dark:text-cream/80 dark:hover:text-sage-light"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={open}
            className="btn-primary hidden sm:inline-flex"
          >
            Get a Quote
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/70 text-emerald lg:hidden dark:border-white/10 dark:bg-white/10 dark:text-cream"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-black/5 bg-cream lg:hidden dark:border-white/10 dark:bg-emerald-deep">
          <div className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal/80 transition-colors hover:bg-black/5 hover:text-emerald dark:text-cream/80 dark:hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                open();
              }}
              className="btn-primary mt-2 w-full"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
