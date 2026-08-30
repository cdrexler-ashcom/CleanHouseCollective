"use client";

import { Icon } from "./Icon";
import { services, standardInclusions, optionalExtras } from "@/data/site";
import { useQuote } from "./QuoteProvider";

export function Services() {
  const { open } = useQuote();

  return (
    <section id="services" className="section bg-white/60 dark:bg-white/[0.03]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our Services</p>
          <h2 className="heading-lg mt-3">Cleaning tailored to your home</h2>
          <p className="mt-5 text-lg text-charcoal/70 dark:text-cream/70">
            We specialise in ongoing home cleaning, with weekly, fortnightly and
            monthly services available — as well as one-off cleans.
          </p>
        </div>

        {/* Service cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className={`card group relative flex flex-col ${
                service.featured
                  ? "ring-2 ring-emerald/40 dark:ring-sage/40"
                  : ""
              }`}
            >
              {service.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-emerald px-3 py-1 text-xs font-semibold text-cream">
                  Most popular
                </span>
              )}
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald text-cream shadow-soft transition-transform group-hover:scale-110">
                <Icon name={service.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">
                {service.title}
              </h3>
              <p className="text-sm font-medium text-sage-dark dark:text-sage-light">
                {service.tagline}
              </p>
              <p className="mt-3 flex-1 text-sm text-charcoal/70 dark:text-cream/70">
                {service.description}
              </p>
              {service.price && (
                <p className="mt-4 font-display text-lg font-bold text-emerald dark:text-sage-light">
                  {service.price}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* What's included + optional extras */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h3 className="font-display text-lg font-bold">
              What&apos;s included in a Standard Refresh
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {standardInclusions.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-charcoal/80 dark:text-cream/80"
                >
                  <Icon
                    name="check"
                    className="h-4 w-4 flex-none text-emerald dark:text-sage-light"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="font-display text-lg font-bold">Optional extras</h3>
            <p className="mt-1 text-sm text-charcoal/60 dark:text-cream/60">
              Add these to your Standard Refresh when arranged before your booking.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {optionalExtras.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-emerald/15 bg-white px-3.5 py-1.5 text-sm text-emerald dark:border-white/10 dark:bg-white/5 dark:text-sage-light"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button type="button" onClick={open} className="btn-primary">
            Request a Quote for Your Home
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
