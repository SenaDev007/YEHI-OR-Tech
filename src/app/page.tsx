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
      <CTASection />
      <Footer />
    </main>
  );
}
