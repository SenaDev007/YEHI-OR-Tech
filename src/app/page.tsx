import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PacksPricing } from "@/components/sections/PacksPricing";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { IASection } from "@/components/sections/IASection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { CTASection } from "@/components/sections/CTASection";

/**
 * Page d'accueil — structure complète selon CDC v4.0 sections 7.1 à 7.10.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <PacksPricing />
      <WhyChooseUs />
      <IASection />
      <ProcessSteps />
      <PortfolioPreview />
      <CTASection />
    </>
  );
}
