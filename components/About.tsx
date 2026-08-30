import { Icon } from "./Icon";
import { valueProps } from "@/data/site";

export function About() {
  return (
    <section id="about" className="section">
      <div className="container-page grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">About Us</p>
          <h2 className="heading-lg mt-3">
            A little help to keep your home feeling fresh
          </h2>
          <p className="mt-6 text-lg text-charcoal/70 dark:text-cream/70">
            Clean House Collective is a local, Kallangur-based cleaning service
            specialising in ongoing home cleaning — weekly, fortnightly and
            monthly — as well as one-off cleans and deeper refreshes.
          </p>
          <p className="mt-4 text-charcoal/70 dark:text-cream/70">
            Our flat-rate pricing is for the service, not the clock. That means
            we focus on completing your agreed clean thoroughly, without rushing
            through your home or watching the time. No surprises on cleaning day
            — you&apos;ll always know your agreed service and price before we
            arrive.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {valueProps.map((value) => (
            <div key={value.title} className="card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald dark:bg-white/10 dark:text-sage-light">
                <Icon name={value.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
