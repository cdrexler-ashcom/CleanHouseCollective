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

export default function Home() {
  return (
    // QuoteProvider makes the questionnaire modal available to every CTA on the page.
    <QuoteProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Pricing />
        <ServiceArea />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </QuoteProvider>
  );
}
