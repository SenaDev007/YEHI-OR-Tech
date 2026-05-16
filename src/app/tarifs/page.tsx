"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import PricingCard from "@/components/ui/PricingCard";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "Quel est le délai de livraison ?",
    a: "Le délai moyen est de 3 à 5 jours ouvrés une fois que nous avons reçu toutes les informations nécessaires sur votre entreprise."
  },
  {
    q: "Que faut-il fournir pour démarrer ?",
    a: "Nous avons besoin de votre nom de domaine (ou nous pouvons vous aider à le choisir), de votre logo (si disponible) et des informations de base sur votre entreprise (horaires, adresse, services)."
  },
  {
    q: "Le support est-il inclus après livraison ?",
    a: "Oui, tous nos packs incluent 30 jours de support technique pour vous aider à prendre en main vos nouveaux outils."
  },
  {
    q: "Proposez-vous des facilités de paiement ?",
    a: "Pour les projets sur mesure plus importants, nous acceptons des paiements échelonnés. Pour les packs crédibilité, le paiement se fait à la commande."
  }
];

const TarifsPage = () => {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="Tarifs & Packs"
            title="Des prix clairs, des livrables précis"
            subtitle="Pas de surprises. Chaque pack est décrit avec exactement ce qui est inclus pour vous aider à avancer sereinement."
          />
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
            <PricingCard 
              name="Pack START"
              price="35 000"
              badge="START"
              badgeColor="bg-green-600"
              cta="Choisir le Pack Start"
              features={[
                "5 adresses email professionnelles",
                "Fiche établissement Google Maps complète",
                "Indexation Google Search Console",
                "Inscription dans 3 annuaires pro",
                "Configuration DNS anti-spam (SPF, DKIM)",
                "Serveur SMTP configuré & prêt"
              ]}
            />
            
            <PricingCard 
              name="Pack BUSINESS"
              price="50 000"
              badge="BUSINESS"
              badgeColor="bg-or"
              recommended
              cta="Choisir le Pack Business"
              features={[
                "25 adresses email professionnelles",
                "Fiche établissement Google Maps complète",
                "Indexation Google Search Console",
                "Inscription dans 5 annuaires pro",
                "Configuration DNS anti-spam (SPF, DKIM)",
                "Propriété vérifiée & Sitemaps soumis",
                "Support prioritaire 30 jours"
              ]}
            />
          </div>

          {/* Details Section */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            <div className="space-y-8">
              <h3 className="text-2xl text-white">Ce qui est inclus en détail</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-or font-bold mb-2">Emails pro</h4>
                  <p className="text-gris text-sm leading-relaxed">
                    Serveur SMTP configuré, accès webmail moderne, compatible Outlook/Gmail. 
                    Utilisez votre propre domaine pour une image institutionnelle.
                  </p>
                </div>
                <div>
                  <h4 className="text-or font-bold mb-2">Google Maps</h4>
                  <p className="text-gris text-sm leading-relaxed">
                    Fiche complète avec photos, horaires, description et catégorie. 
                    Soyez visible quand vos clients vous cherchent localement.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8 md:pt-16">
              <div className="space-y-6">
                <div>
                  <h4 className="text-or font-bold mb-2">Search Console</h4>
                  <p className="text-gris text-sm leading-relaxed">
                    Propriété vérifiée, sitemaps soumis, suivi des positions. 
                    Nous informons Google de l'existence de votre site officiellement.
                  </p>
                </div>
                <div>
                  <h4 className="text-or font-bold mb-2">Sécurité DNS</h4>
                  <p className="text-gris text-sm leading-relaxed">
                    Enregistrements SPF, DKIM, DMARC configurés pour éviter 
                    que vos emails ne finissent en spam chez vos clients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-2xl text-white mb-4">Questions fréquentes</h3>
              <p className="text-gris">Tout ce que vous devez savoir avant de démarrer.</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-noir-2 border border-white/5 rounded-2xl p-6">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-or" />
                    {faq.q}
                  </h4>
                  <p className="text-gris text-sm leading-relaxed ml-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
};

export default TarifsPage;
