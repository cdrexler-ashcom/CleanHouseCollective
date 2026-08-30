"use client";

import { Icon } from "./Icon";
import { pricing, site } from "@/data/site";
import { useQuote } from "./QuoteProvider";

const quoteSteps = [
  {
    icon: "image",
    title: "Send a few photos",
    text: "Share current photos or a short video of your main areas — especially the kitchen and bathroom/s.",
  },
  {
    icon: "sparkles",
    title: "Don't tidy up for us!",
    text: "Seeing your home as it normally is helps us understand its size, layout and cleaning requirements.",
  },
  {
    icon: "tag",
    title: "Get your flat rate",
    text: "We'll confirm your agreed service and flat-rate price before your booking. No surprises on cleaning day.",
  },
];

export function Pricing() {
  const { open } = useQuote();

  return (
    <section id="pricing" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Simple, All-Inclusive Pricing</p>
          <h2 className="heading-lg mt-3">Flat-rate cleaning, no surprises</h2>
          <p className="mt-5 text-lg text-charcoal/70 dark:text-cream/70">
            Your quoted flat rate includes fuel, insurance, professional
            equipment, cleaning products and labour. There&apos;s nothing for
            you to supply — we arrive fully equipped and ready to get your home
            feeling fresh again.
          </p>
        </div>

        {/* Standard Refresh starting prices */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {pricing.map((tier) => (
            <div
              key={tier.label}
              className="card flex flex-col items-center text-center"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-sage-dark dark:text-sage-light">
                Standard Refresh
              </p>
              <h3 className="mt-2 font-display text-lg font-bold">
                {tier.label}
              </h3>
              <p className="mt-4 font-display text-4xl font-bold text-emerald dark:text-sage-light">
                from {tier.price}
              </p>
              <p className="text-sm text-charcoal/60 dark:text-cream/60">
                {tier.unit}
              </p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-charcoal/60 dark:text-cream/60">
          Starting prices are for homes requiring regular maintenance cleaning.
          Your final flat-rate price is confirmed before your first clean, based
          on the size, layout and typical cleaning requirements of your home.
          Larger home or something specific in mind? Let us know when requesting
          your quote.
        </p>

        {/* How to get a quote */}
        <div className="mt-16">
          <h3 className="text-center font-display text-2xl font-bold">
            Getting your quote is easy
          </h3>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {quoteSteps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald text-cream shadow-soft">
                  <Icon name={step.icon} className="h-7 w-7" />
                </span>
                <span className="mt-2 block text-xs font-bold uppercase tracking-widest text-sage-dark dark:text-sage-light">
                  Step {i + 1}
                </span>
                <h4 className="mt-1 font-display text-lg font-bold">
                  {step.title}
                </h4>
                <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl bg-emerald px-8 py-10 text-center text-cream shadow-soft-lg">
          <p className="font-display text-2xl font-bold">
            {site.offers.newClient}
          </p>
          <p className="mt-2 text-cream/80">
            New clients only. Get in touch for your personalised quote — you can
            even add photos of your home right from the questionnaire.
          </p>
          <button
            type="button"
            onClick={open}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-emerald transition-all hover:bg-white hover:shadow-soft-lg active:scale-[0.98]"
          >
            Start Your Quote
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
