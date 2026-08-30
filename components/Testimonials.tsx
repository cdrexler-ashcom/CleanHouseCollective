import { testimonials } from "@/data/site";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Client Reviews</p>
          <h2 className="heading-lg mt-3">18 five-star reviews &amp; counting</h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="text-sm font-medium text-charcoal/60 dark:text-cream/60">
              Verified Airtasker feedback
            </span>
          </div>
        </div>

        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="card break-inside-avoid">
              <Stars count={t.rating} />
              <blockquote className="mt-4 text-charcoal/80 dark:text-cream/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-black/5 pt-4 dark:border-white/10">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-charcoal/60 dark:text-cream/60">
                  {t.service} · {t.timeAgo}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
