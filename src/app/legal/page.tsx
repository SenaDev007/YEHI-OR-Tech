"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5">
        <div className="container mx-auto px-6">
          <SectionHeader 
            tag="Conformité"
            title="Mentions Légales"
          />
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 text-gris space-y-12 max-w-4xl">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">1. Éditeur du site</h2>
            <p className="leading-relaxed">
              Le site <span className="text-or">yehiortech.com</span> est édité par l'agence <span className="text-white">YEHI OR Tech</span>, 
              une entreprise numérique spécialisée dans le développement de solutions logicielles et l'intégration de l'IA.
            </p>
            <p className="mt-4">Siège social : Parakou, Bénin — Afrique de l'Ouest.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">2. Direction de la publication</h2>
            <p className="leading-relaxed">Le directeur de la publication est Dawes S. Akpowi Tohou, en sa qualité de fondateur de YEHI OR Tech.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">3. Hébergement</h2>
            <p className="leading-relaxed">
              Le présent site est hébergé par la société <span className="text-white">Vercel Inc.</span>, 
              dont le siège social est situé au 340 S Lemon Ave #1142, Walnut, CA 91789, USA.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">4. Propriété intellectuelle</h2>
            <p className="leading-relaxed">
              L'ensemble de ce site relève de la législation internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">5. Contact</h2>
            <p className="leading-relaxed">
              Pour toute question ou demande d'information concernant le site, ou toute notification de contenu inadapté ou illégal, 
              vous pouvez nous contacter à l'adresse suivante : <span className="text-or">contact@yehiortech.com</span>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
