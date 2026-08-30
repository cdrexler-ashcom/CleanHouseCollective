import { Logo } from "./Logo";
import { site } from "@/data/site";

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Pricing", href: "#pricing" },
      { label: "Service Area", href: "#service-area" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Reviews", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-white/60 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo showText={false} />
            <p className="mt-5 max-w-sm text-sm text-charcoal/70 dark:text-cream/70">
              {site.tagline} Regular domestic house cleaning based in Kallangur,
              servicing North Brisbane &amp; Moreton Bay within approximately a
              30 km radius.
            </p>
            <div className="mt-6 space-y-1 text-sm">
              <a
                href={`mailto:${site.contact.email}`}
                className="block font-medium text-emerald hover:underline dark:text-sage-light"
              >
                {site.contact.email}
              </a>
              <a
                href={site.contact.phoneHref}
                className="block font-medium text-emerald hover:underline dark:text-sage-light"
              >
                {site.contact.phone}
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-charcoal/60 dark:text-cream/60">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-charcoal/70 transition-colors hover:text-emerald dark:text-cream/70 dark:hover:text-sage-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 text-sm text-charcoal/60 dark:border-white/10 dark:text-cream/60 sm:flex-row">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>Come home to fresh, without the fuss.</p>
        </div>
      </div>
    </footer>
  );
}
