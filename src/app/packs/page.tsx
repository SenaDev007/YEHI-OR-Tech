import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import PacksPricing from "@/components/sections/PacksPricing";
import CTASection from "@/components/sections/CTASection";

export default function PacksPage() {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader
            tag="Offres & Packs"
            title="Des solutions structurées pour avancer vite"
            subtitle="Des solutions packagées pour répondre rapidement aux besoins de crédibilité et de visibilité de votre entreprise."
          />
        </div>
      </section>

      <PacksPricing />

      <section className="py-24 bg-noir-profond">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-white mb-6">Des packs pour chaque étape de croissance</h2>
            <p className="text-gris text-lg leading-relaxed">
              Que vous lanciez votre activité ou que vous souhaitiez professionnaliser votre
              image existante, nos packs sont conçus pour offrir le meilleur rapport qualité-prix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                t: "Pack Site Vitrine",
                d: "Un site de 1 à 5 pages, responsive, avec SEO de base et bouton WhatsApp. Idéal pour présenter vos services.",
                price: "Sur devis"
              },
              {
                t: "Pack Business Digital",
                d: "Site vitrine + Emails pro + Fiche Google Business + Visuels réseaux sociaux. La totale pour votre lancement.",
                price: "Sur devis"
              },
              {
                t: "Pack IA Starter",
                d: "Agent IA WhatsApp ou Web avec base de connaissance simple pour automatiser vos premières réponses.",
                price: "Sur devis"
              }
            ].map((p, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-noir-2 border border-white/5 hover:border-or/30 flex flex-col h-full transition-all duration-300">
                <h3 className="text-xl text-white mb-4 group-hover:text-or transition-colors">{p.t}</h3>
                <p className="text-gris text-sm leading-relaxed mb-8 flex-grow">{p.d}</p>
                <div className="text-or font-bold font-mono text-sm uppercase tracking-widest">{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
