import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

// Phase 4 : Dynamic imports pour les sections sous la ligne de flottaison.
// Le HTML est rendu en SSG (SSR par défaut dans next/dynamic), mais le JS
// est lazy-loaded → réduit drastiquement le bundle initial.
// loading placeholder réserve la hauteur → CLS = 0.

const StatsBar = dynamic(() => import("@/components/sections/StatsBar").then(m => ({ default: m.StatsBar })), {
  loading: () => <div style={{ minHeight: 240 }} aria-hidden />,
});

const ServicesGrid = dynamic(() => import("@/components/sections/ServicesGrid").then(m => ({ default: m.ServicesGrid })), {
  loading: () => <div style={{ minHeight: 600 }} aria-hidden />,
});

const PacksPricing = dynamic(() => import("@/components/sections/PacksPricing").then(m => ({ default: m.PacksPricing })), {
  loading: () => <div style={{ minHeight: 500 }} aria-hidden />,
});

const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs").then(m => ({ default: m.WhyChooseUs })), {
  loading: () => <div style={{ minHeight: 500 }} aria-hidden />,
});

const IASection = dynamic(() => import("@/components/sections/IASection").then(m => ({ default: m.IASection })), {
  loading: () => <div style={{ minHeight: 500 }} aria-hidden />,
});

const ProcessSteps = dynamic(() => import("@/components/sections/ProcessSteps").then(m => ({ default: m.ProcessSteps })), {
  loading: () => <div style={{ minHeight: 500 }} aria-hidden />,
});

const PortfolioPreview = dynamic(() => import("@/components/sections/PortfolioPreview").then(m => ({ default: m.PortfolioPreview })), {
  loading: () => <div style={{ minHeight: 500 }} aria-hidden />,
});

const CTASection = dynamic(() => import("@/components/sections/CTASection").then(m => ({ default: m.CTASection })), {
  loading: () => <div style={{ minHeight: 400 }} aria-hidden />,
});

/**
 * Page d'accueil — structure complète selon CDC v4.0 sections 7.1 à 7.10.
 * Hero est chargé normalement (LCP), les autres sections sont lazy-loaded.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="section-below-fold">
        <StatsBar />
        <ServicesGrid />
        <PacksPricing />
        <WhyChooseUs />
        <IASection />
        <ProcessSteps />
        <PortfolioPreview />
        <CTASection />
      </div>
    </>
  );
}
