import { QuoteProvider } from "@/components/QuoteProvider";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { ServiceArea } from "@/components/ServiceArea";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Reveal } from "@/components/Reveal";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    // QuoteProvider makes the questionnaire modal available to every CTA on the page.
    <QuoteProvider>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />

        {/* Below-the-fold sections gently reveal as they enter the viewport,
            with animated emblem dividers punctuating the transitions. */}
        <Reveal>
          <About />
        </Reveal>

        <SectionDivider />

        <Reveal>
          <Services />
        </Reveal>

        <SectionDivider />

        <Reveal>
          <Pricing />
        </Reveal>

        <SectionDivider />

        <Reveal>
          <ServiceArea />
        </Reveal>

        <SectionDivider />

        <Reveal>
          <Testimonials />
        </Reveal>

        <SectionDivider />

        <Reveal>
          <FAQ />
        </Reveal>

        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Footer />
    </QuoteProvider>
  );
}
