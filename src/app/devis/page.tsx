"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "@/components/ui/ContactForm";
import { ClipboardList } from "lucide-react";

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="Devis Gratuit"
            title="Décrivez votre vision"
            subtitle="Parlez-nous de vos besoins. Nous vous fournirons une proposition détaillée et adaptée à votre budget sous 24h à 48h."
          />
        </div>
      </section>
      
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-[40px] bg-noir-2 border border-white/5 shadow-2xl relative overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-or/5 rounded-full blur-[100px]" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-or/10 flex items-center justify-center">
                    <ClipboardList className="text-or w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Formulaire de projet</h2>
                    <p className="text-gris text-sm">Remplissez les champs ci-dessous avec précision pour un devis optimal.</p>
                  </div>
                </div>
                
                <ContactForm />
              </div>
            </div>
            
            <div className="mt-12 text-center text-gris text-sm">
              <p>Besoin d'aide ? Contactez-nous directement à <span className="text-or">contact@yehiortech.com</span></p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
