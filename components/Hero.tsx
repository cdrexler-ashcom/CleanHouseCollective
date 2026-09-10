"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Icon } from "./Icon";
import { useQuote } from "./QuoteProvider";
import { site } from "@/data/site";
import { CountUp } from "./CountUp";

const trustPoints = [
  { icon: "shield", label: "Fully insured" },
  { icon: "tag", label: "All-inclusive flat rate" },
  { icon: "leaf", label: "Gentle products" },
];

const stats = [
  { end: 18, suffix: "", label: "Five-star reviews" },
  { end: 30, suffix: "km", label: "Service radius" },
  { end: 100, suffix: "%", label: "Satisfaction focus" },
];

export function Hero() {
  const { open } = useQuote();
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Subtle pointer parallax on the hero card — desktop / fine-pointer only, so
  // it never costs anything on touch devices. Transform-only for 60fps.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reduced) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateY(${px * 6}deg) rotateX(${
          -py * 6
        }deg)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28"
    >
      {/* Animated aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-aurora absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sage/30 blur-3xl" />
        <div className="animate-aurora-slow absolute top-40 -left-32 h-96 w-96 rounded-full bg-emerald/10 blur-3xl" />
        <div className="animate-aurora absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sage-light/20 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-16 lg:grid-cols-2">
        {/* Copy */}
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald/15 bg-white/70 px-4 py-1.5 text-xs font-semibold text-emerald shadow-soft dark:bg-white/10 dark:text-sage-light">
            <Icon name="mapPin" className="h-4 w-4" />
            {site.contact.serviceArea}
          </span>

          <h1 className="heading-xl mt-6">
            Come home to fresh,{" "}
            <span className="text-shimmer">without the fuss</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-charcoal/70 dark:text-cream/70">
            Regular domestic house cleaning based in Kallangur, servicing homes
            across North Brisbane &amp; Moreton Bay. We take care of the cleaning
            so you can spend less time worrying about the house — and more time
            enjoying it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={open}
              className="btn-primary sheen"
            >
              Get a Free Quote
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
            <a href={site.contact.phoneHref} className="btn-secondary">
              <Icon name="phone" className="h-4 w-4" />
              {site.contact.phone}
            </a>
          </div>

          {/* New client offer */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-2 text-sm font-semibold text-emerald dark:bg-white/10 dark:text-sage-light">
            <Icon name="tag" className="h-4 w-4" />
            {site.offers.newClient} — new clients
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {trustPoints.map((point) => (
              <li
                key={point.label}
                className="flex items-center gap-2 text-sm font-medium text-charcoal/70 dark:text-cream/70"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10 text-emerald dark:bg-white/10 dark:text-sage-light">
                  <Icon name={point.icon} className="h-4 w-4" />
                </span>
                {point.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual — brand logo feature card */}
        <div className="relative animate-scale-in [perspective:1000px]">
          <div
            ref={cardRef}
            className="animate-float relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sage-light/50 via-cream to-sage/30 p-6 shadow-soft-lg transition-transform duration-200 ease-out will-change-transform sm:p-8 dark:from-emerald-light/30 dark:via-emerald-deep dark:to-emerald/20"
          >
            {/* Readable, softly-rounded cream panel holding the vector logo */}
            <div className="relative flex aspect-[4/5] items-center justify-center rounded-[1.6rem] bg-cream/90 p-8 shadow-soft ring-1 ring-black/5 backdrop-blur-sm sm:p-12">
              <Image
                src="/logo.svg"
                alt="Clean House Collective"
                width={360}
                height={300}
                className="h-auto w-full max-w-[17rem] object-contain"
                priority
              />
            </div>
          </div>

          {/* Floating rating card */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-5 shadow-soft-lg sm:block dark:bg-emerald-deep">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              ))}
            </div>
            <p className="mt-1 text-sm font-semibold">
              <CountUp end={18} /> five-star reviews
            </p>
            <p className="text-xs text-charcoal/60 dark:text-cream/60">
              Trusted by local homes
            </p>
          </div>
        </div>
      </div>

      {/* Animated stats strip */}
      <div className="container-page mt-16 lg:mt-24">
        <dl className="grid grid-cols-3 gap-4 rounded-3xl border border-black/5 bg-white/60 p-6 text-center shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:gap-8 sm:p-8">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-3xl font-bold text-emerald dark:text-sage-light sm:text-4xl">
                <CountUp end={s.end} suffix={s.suffix} />
              </dd>
              <dt className="mt-1 text-xs font-medium text-charcoal/60 dark:text-cream/60 sm:text-sm">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
