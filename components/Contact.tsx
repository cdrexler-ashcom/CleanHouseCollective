"use client";

import { Icon } from "./Icon";
import { site } from "@/data/site";
import { useQuote } from "./QuoteProvider";

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
        <div className="relative overflow-hidden rounded-3xl bg-emerald px-6 py-12 text-cream shadow-soft-lg sm:px-10 sm:py-14 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute -top-16 right-10 h-64 w-64 rounded-full bg-sage-light/40 blur-3xl" />
            <div className="absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-emerald-light/60 blur-3xl" />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage-light">
                Get in touch
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Ready for a fresher home?
              </h2>
              <p className="mt-5 max-w-md text-cream/80">
                Whether you&apos;re after a weekly helping hand, a fortnightly
                refresh or your home needs some extra attention, we&apos;d love
                to hear from you. Request your personalised flat-rate quote in
                under a minute — photos optional but welcome.
              </p>

              <button
                type="button"
                onClick={open}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-emerald transition-all hover:bg-white hover:shadow-soft-lg active:scale-[0.98] sm:w-auto"
              >
                Get a Free Quote
                <Icon name="arrowRight" className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4">
              {methods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-6 sm:py-5"
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
