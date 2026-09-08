"use client";

import { Icon } from "./Icon";
import { site } from "@/data/site";
import { useQuote } from "./QuoteProvider";

/**
 * Contact / final call-to-action card.
 *
 * Rebuilt to be bulletproof on mobile:
 *  - The decorative blur "blobs" live in their OWN absolutely-positioned,
 *    `overflow-hidden` layer (behind the content via `-z-10` + `isolate`).
 *    The content itself is never inside an `overflow-hidden` box, so the
 *    heading can never be clipped.
 *  - Every grid/flex child gets `min-w-0` so it can shrink below its intrinsic
 *    content width. Without this, the long email address
 *    (cleanhousecollective@outlook.com) sets a large min-content width that
 *    blows the grid wider than the screen — which was clipping the heading.
 *  - The email value uses `break-words` so it wraps instead of overflowing.
 */
export function Contact() {
  const { open } = useQuote();

  const methods = [
    {
      icon: "mail",
      label: "Email us",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    {
      icon: "phone",
      label: "Call us",
      value: site.contact.phone,
      href: site.contact.phoneHref,
    },
    {
      icon: "mapPin",
      label: "Based in",
      value: site.contact.baseLocation,
      href: "#service-area",
    },
  ];

  return (
    <section id="contact" className="section">
      <div className="container-page">
        {/* `isolate` creates a stacking context so the decorative layer can sit
            safely behind the content with -z-10. */}
        <div className="relative isolate rounded-3xl bg-emerald text-cream shadow-soft-lg">
          {/* Decorative layer — clipped on its own so it can never influence
              the width/height of the actual content. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl opacity-30"
          >
            <div className="absolute -top-16 right-4 h-56 w-56 rounded-full bg-sage-light/40 blur-3xl sm:right-10 sm:h-64 sm:w-64" />
            <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-emerald-light/60 blur-3xl sm:h-64 sm:w-64" />
          </div>

          {/* Content grid. Padding scales with screen size. */}
          <div className="grid gap-8 p-6 sm:gap-10 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-16">
            {/* Left: heading + CTA */}
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage-light">
                Get in touch
              </p>
              <h2 className="mt-3 font-display text-[1.6rem] font-bold leading-tight xs:text-3xl sm:text-4xl">
                Ready for a fresher home?
              </h2>
              <p className="mt-4 max-w-md text-sm text-cream/80 sm:mt-5 sm:text-base">
                Whether you&apos;re after a weekly helping hand, a fortnightly
                refresh or your home needs some extra attention, we&apos;d love
                to hear from you. Request your personalised flat-rate quote in
                under a minute — photos optional but welcome.
              </p>

              <button
                type="button"
                onClick={open}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-emerald transition-all hover:bg-white hover:shadow-soft-lg active:scale-[0.98] sm:mt-8 sm:w-auto"
              >
                Get a Free Quote
                <Icon name="arrowRight" className="h-4 w-4 flex-none" />
              </button>
            </div>

            {/* Right: contact methods */}
            <div className="grid min-w-0 gap-3 sm:gap-4">
              {methods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-6 sm:py-5"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-cream text-emerald">
                    <Icon name={method.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-sage-light">
                      {method.label}
                    </span>
                    <span className="block break-words font-semibold">
                      {method.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
