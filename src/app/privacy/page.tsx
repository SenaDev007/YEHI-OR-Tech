"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      <section className="pt-64 pb-32 relative overflow-hidden">
        {/* Background Halos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            tag="Privacy"
            title="Protection des Données"
            subtitle="Notre engagement envers la sécurité de vos informations et le respect de votre vie privée dans l'espace numérique."
          />
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Safety</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6 text-gris space-y-24 max-w-5xl">
          <p className="text-3xl text-white leading-tight italic opacity-90">
            Chez <span className="text-or">YEHI OR Tech</span>, nous considérons la protection de vos données comme un pilier fondamental de notre relation de confiance.
          </p>

          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">01 — Collecte</h2>
            <p className="text-2xl text-white leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
              Nous collectons les données que vous nous fournissez volontairement via nos interfaces sécurisées. 
              Ces informations sont limitées au strict nécessaire pour la réalisation de vos projets technologiques.
            </p>
          </div>

          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">02 — Utilisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              {[
                "Traitement de vos demandes de devis",
                "Suivi opérationnel des projets",
                "Optimisation de l'expérience utilisateur",
                "Communications techniques et alertes"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-2 h-2 glass pill bg-or flex-shrink-0" />
                  <p className="text-xl text-white opacity-70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">03 — Sécurité</h2>
            <p className="text-2xl text-white leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
              Nous déployons des protocoles de sécurité de niveau entreprise pour garantir l'intégrité de vos données. 
              Aucune information n'est cédée ou vendue à des tiers.
            </p>
          </div>

          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">04 — Vos droits</h2>
            <p className="text-2xl text-white leading-tight mb-8">
              Vous gardez le contrôle total sur vos données personnelles (accès, rectification, suppression).
            </p>
            <div className="glass pill px-10 py-6 inline-block text-white text-2xl group-hover:bg-or group-hover:text-noir-profond transition-all duration-700">
              contact@yehiortech.com
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
