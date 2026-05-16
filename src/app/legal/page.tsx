"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";

export default function LegalPage() {
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
            tag="Conformité"
            title="Mentions Légales"
            subtitle="Informations officielles concernant l'édition, l'hébergement et la propriété intellectuelle de YEHI OR Tech."
          />
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Legal</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6 text-gris space-y-24 max-w-5xl">
          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">01 — Éditeur du site</h2>
            <p className="text-2xl text-white leading-tight mb-6">
              Le site <span className="text-or">yehiortech.com</span> est édité par l'agence <span className="text-white italic">YEHI OR Tech</span>, 
              une organisation technologique spécialisée dans la production digitale de haute précision.
            </p>
            <p className="text-xl opacity-60 group-hover:opacity-100 transition-opacity">Siège social : Parakou, Bénin — Afrique de l'Ouest.</p>
          </div>

          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">02 — Direction</h2>
            <p className="text-2xl text-white leading-tight">Le directeur de la publication est Dawes S. Akpowi Tohou, Fondateur & Lead Architect de YEHI OR Tech.</p>
          </div>

          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">03 — Hébergement</h2>
            <p className="text-2xl text-white leading-tight mb-6">
              Infrastructure opérée par <span className="text-white italic">Vercel Inc.</span>
            </p>
            <p className="text-xl opacity-60 group-hover:opacity-100 transition-opacity">340 S Lemon Ave #1142, Walnut, CA 91789, USA.</p>
          </div>

          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">04 — Propriété</h2>
            <p className="text-2xl text-white leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
              L'ensemble de ce site relève de la législation internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques.
            </p>
          </div>

          <div className="group">
            <h2 className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-8">05 — Contact</h2>
            <p className="text-2xl text-white leading-tight mb-8">
              Pour toute notification légale ou demande d'information :
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
