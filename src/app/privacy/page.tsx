"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5">
        <div className="container mx-auto px-6">
          <SectionHeader 
            tag="Confidentialité"
            title="Politique de Protection des Données"
          />
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 text-gris space-y-12 max-w-4xl">
          <p className="text-lg leading-relaxed italic">
            Chez <span className="text-white">YEHI OR Tech</span>, nous accordons une importance primordiale à la protection de votre vie privée et à la sécurité de vos données personnelles.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">1. Collecte des données</h2>
            <p className="leading-relaxed">
              Nous collectons les données que vous nous fournissez volontairement via nos formulaires de contact, 
              de demande de devis et lors de nos échanges par email ou WhatsApp. Ces données incluent généralement : 
              votre nom, adresse email, numéro de téléphone et les détails de votre projet.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">2. Utilisation des données</h2>
            <p className="leading-relaxed">
              Vos données sont exclusivement utilisées pour :
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Traiter vos demandes de devis et répondre à vos messages.</li>
              <li>Établir des relations commerciales et assurer le suivi de vos projets.</li>
              <li>Améliorer l'expérience utilisateur sur notre site web.</li>
              <li>Vous informer des mises à jour importantes concernant nos services (si vous y avez consenti).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">3. Protection et conservation</h2>
            <p className="leading-relaxed">
              Nous mettons en œuvre toutes les mesures de sécurité nécessaires pour protéger vos données contre tout accès non autorisé. 
              Nous ne vendons, n'échangeons, ni ne transférons vos informations personnelles identifiables à des tiers sans votre consentement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">4. Vos droits</h2>
            <p className="leading-relaxed">
              Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. 
              Pour exercer ce droit, contactez-nous simplement à : <span className="text-or">contact@yehiortech.com</span>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
