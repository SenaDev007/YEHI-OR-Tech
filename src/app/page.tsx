import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import ServicesGrid from "@/components/sections/ServicesGrid";
import PacksPricing from "@/components/sections/PacksPricing";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import IASection from "@/components/sections/IASection";
import ProcessSteps from "@/components/sections/ProcessSteps";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import FAQ from "@/components/ui/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <PacksPricing />
      <WhyChooseUs />
      <IASection />
      <ProcessSteps />
      <PortfolioPreview />
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="site-container grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="mt-5 text-noir-profond">Tout éclaircir avant de commencer.</h2>
          </div>
          <FAQ />
        </div>
      </section>
      <CTASection />
      <Footer />
    </main>
  );
}
