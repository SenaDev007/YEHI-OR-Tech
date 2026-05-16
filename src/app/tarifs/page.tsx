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
      <section className="pt-64 pb-32 relative overflow-hidden">
        {/* Background Halos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="Investment"
            title="Des prix clairs, des livrables précis"
            subtitle="Pas de compromis. Chaque pack est structuré pour délivrer une valeur immédiate et une infrastructure durable."
          />
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Pricing</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto mb-48">
            <PricingCard 
              name="Pack START"
              price="35 000"
              badge="START"
              badgeColor="bg-noir-3"
              cta="Choisir le Pack Start"
              features={[
                "5 adresses email professionnelles",
                "Fiche Google Maps complète",
                "Indexation Google Search Console",
                "Inscription dans 3 annuaires pro",
                "Configuration DNS anti-spam (SPF, DKIM)",
                "Serveur SMTP configuré & prêt"
              ]}
            />
            
            <div className="lg:mt-32">
              <PricingCard 
                name="Pack BUSINESS"
                price="50 000"
                badge="BUSINESS"
                badgeColor="bg-noir-3"
                recommended
                cta="Choisir la puissance"
                features={[
                  "25 adresses email professionnelles",
                  "Fiche Google Maps premium",
                  "Indexation Google Search Console",
                  "Inscription dans 5 annuaires pro",
                  "Configuration DNS anti-spam (SPF, DKIM)",
                  "Propriété vérifiée & Sitemaps soumis",
                  "Support prioritaire 30 jours"
                ]}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 mb-48">
            <div className="space-y-12">
              <h3 className="text-4xl text-white uppercase tracking-tighter">Infrastructures</h3>
              <div className="space-y-12">
                <div className="group">
                  <h4 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-4">Emails pro</h4>
                  <p className="text-xl text-gris leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    Serveur SMTP configuré, accès webmail moderne, compatible Outlook/Gmail. 
                    Utilisez votre propre domaine pour une image institutionnelle.
                  </p>
                </div>
                <div className="group">
                  <h4 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-4">Google Maps</h4>
                  <p className="text-xl text-gris leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    Fiche complète avec photos, horaires, description et catégorie. 
                    Soyez visible quand vos clients vous cherchent localement.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-12 md:pt-24">
              <div className="space-y-12">
                <div className="group">
                  <h4 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-4">Search Console</h4>
                  <p className="text-xl text-gris leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    Propriété vérifiée, sitemaps soumis, suivi des positions. 
                    Nous informons Google de l'existence de votre site officiellement.
                  </p>
                </div>
                <div className="group">
                  <h4 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-4">Sécurité DNS</h4>
                  <p className="text-xl text-gris leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    Enregistrements SPF, DKIM, DMARC configurés pour éviter 
                    que vos emails ne finissent en spam chez vos clients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-24">
              <Tag>FAQ</Tag>
              <h3 className="text-4xl text-white mt-8 uppercase tracking-tighter">Questions fréquentes</h3>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="group glass p-10 rounded-[2rem] hover:bg-white/[0.06] transition-all duration-700">
                  <h4 className="text-2xl text-white mb-6 uppercase tracking-tight leading-none flex items-center gap-4">
                    <div className="w-10 h-10 glass pill flex items-center justify-center text-or">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    {faq.q}
                  </h4>
                  <p className="text-lg text-gris leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity ml-14">
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
