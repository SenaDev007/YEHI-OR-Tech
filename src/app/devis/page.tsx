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
      <section className="pt-64 pb-32 relative overflow-hidden">
        {/* Background Halos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="Inquiry"
            title="Décrivez votre vision"
            subtitle="Parlez-nous de vos besoins. Nous vous fournirons une proposition détaillée et adaptée à votre budget sous 24h à 48h."
          />
        </div>
      </section>
      
      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Estimate</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="glass p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              {/* Decorative Glow */}
              <div className="absolute -top-40 -right-40 w-80 h-80 glow-radial opacity-5 group-hover:opacity-10 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-8 mb-16">
                  <div className="w-16 h-16 glass pill flex items-center justify-center text-or group-hover:bg-or group-hover:text-noir-profond transition-all duration-700">
                    <ClipboardList className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-white uppercase tracking-tighter leading-none mb-2">Cahier des charges</h2>
                    <p className="text-lg text-gris opacity-80">Remplissez les champs ci-dessous avec précision pour un devis optimal.</p>
                  </div>
                </div>
                
                <ContactForm />
              </div>
            </div>
            
            <div className="mt-20 text-center">
              <p className="text-xl text-gris opacity-50">Besoin d'aide ? Contactez-nous directement à <span className="text-white hover:text-or transition-colors cursor-pointer">contact@yehiortech.com</span></p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
