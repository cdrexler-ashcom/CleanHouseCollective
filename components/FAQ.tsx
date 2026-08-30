"use client";

import { useState } from "react";
import { faqs } from "@/data/site";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-white/60 dark:bg-white/[0.03]">
      <div className="container-page grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="heading-lg mt-3">Questions? We&apos;ve got answers</h2>
          <p className="mt-5 text-lg text-charcoal/70 dark:text-cream/70">
            Everything you need to know about booking a clean with us.
            Can&apos;t find what you&apos;re after? Just reach out.
          </p>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="py-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-semibold">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald/10 text-emerald transition-transform duration-300 dark:bg-white/10 dark:text-sage-light ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-12 text-charcoal/70 dark:text-cream/70">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
