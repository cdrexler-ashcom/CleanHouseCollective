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

export default function Home() {
  return (
    // QuoteProvider makes the questionnaire modal available to every CTA on the page.
    <QuoteProvider>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        {/* Below-the-fold sections gently reveal as they enter the viewport. */}
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Services />
        </Reveal>
        <Reveal>
          <Pricing />
        </Reveal>
        <Reveal>
          <ServiceArea />
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
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
