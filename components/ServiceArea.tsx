"use client";

import { Icon } from "./Icon";
import { serviceAreas } from "@/data/site";
import { useQuote } from "./QuoteProvider";

export function ServiceArea() {
  const { open } = useQuote();

  return (
    <section id="service-area" className="section bg-white/60 dark:bg-white/[0.03]">
      <div className="container-page grid gap-16 lg:grid-cols-2 lg:items-center">
        {/* Map motif */}
        <div className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-sage-light/40 to-emerald/10 p-1 shadow-soft dark:border-white/10">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.4rem]">
              <div className="absolute inset-0 opacity-40">
                <svg viewBox="0 0 400 300" className="h-full w-full">
                  <g stroke="#0D4F45" strokeOpacity="0.25" fill="none">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 35} x2="400" y2={i * 35} />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line key={`v${i}`} x1={i * 35} y1="0" x2={i * 35} y2="300" />
                    ))}
                  </g>
                </svg>
              </div>
              <div className="relative flex flex-col items-center gap-3 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald text-cream shadow-soft-lg">
                  <Icon name="mapPin" className="h-8 w-8" />
                </span>
                <p className="font-display text-lg font-bold text-emerald-deep dark:text-cream">
                  Based in Kallangur
                </p>
                <p className="max-w-xs text-sm text-emerald-deep/70 dark:text-cream/70">
                  Servicing homes within approximately a 30 km radius.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copy + suburbs */}
        <div className="order-1 lg:order-2">
          <p className="eyebrow">Service Area</p>
          <h2 className="heading-lg mt-3">Servicing North Brisbane &amp; Moreton Bay</h2>
          <p className="mt-5 text-lg text-charcoal/70 dark:text-cream/70">
            We&apos;re based in Kallangur and clean homes within roughly a 30 km
            radius. Here are just some of the suburbs we service:
          </p>

          <ul className="mt-7 flex flex-wrap gap-2.5">
            {serviceAreas.map((area) => (
              <li
                key={area}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald/15 bg-white px-4 py-2 text-sm font-medium text-emerald shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-sage-light"
              >
                <Icon name="check" className="h-3.5 w-3.5" />
                {area}
              </li>
            ))}
          </ul>

          <p className="mt-7 text-sm text-charcoal/70 dark:text-cream/70">
            Outside our usual area? We may still be able to help — a small travel
            fee may apply.{" "}
            <button
              type="button"
              onClick={open}
              className="font-semibold text-emerald underline-offset-4 hover:underline dark:text-sage-light"
            >
              Get in touch for a quote
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
