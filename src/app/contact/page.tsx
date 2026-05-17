"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "@/components/ui/ContactForm";
import { Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-64 pb-32 relative overflow-hidden">
        {/* Background Halos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute inset-0 bg-[url('/images/heroes/contact.png')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-noir-profond/60 to-noir-profond" />
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="Let's Talk"
            title="Parlons de votre projet"
            subtitle="Décrivez votre besoin. Nous vous répondons sous 48h avec une proposition claire et une estimation réaliste."
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Contact</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-32">
            
            {/* Contact Info */}
            <div className="lg:w-2/5 space-y-20">
              <div>
                <h3 className="text-white text-4xl mb-12 uppercase tracking-tighter">Informations</h3>
                <div className="space-y-12">
                  <div className="flex gap-8 group">
                    <div className="w-16 h-16 glass pill flex items-center justify-center flex-shrink-0 group-hover:bg-or group-hover:text-noir-profond transition-all duration-700">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] mb-2">Localisation</h4>
                      <p className="text-2xl text-white leading-tight">
                        Parakou, Bénin<br />Afrique de l'Ouest
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8 group">
                    <div className="w-16 h-16 glass pill flex items-center justify-center flex-shrink-0 group-hover:bg-or group-hover:text-noir-profond transition-all duration-700">
                      <Mail className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] mb-2">Email</h4>
                      <p className="text-2xl text-white leading-tight">contact@yehiortech.com</p>
                    </div>
                  </div>

                  <div className="flex gap-8 group">
                    <div className="w-16 h-16 glass pill flex items-center justify-center flex-shrink-0 group-hover:bg-or group-hover:text-noir-profond transition-all duration-700">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] mb-2">Disponibilité</h4>
                      <p className="text-2xl text-white leading-tight">Lun–Sam, 8h–20h (GMT+1)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 glass rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 glow-radial opacity-10 group-hover:opacity-20 transition-opacity" />
                <h4 className="text-white text-2xl font-display mb-6 flex items-center gap-4">
                  <MessageCircle className="w-8 h-8 text-[#25D366]" />
                  Réponse directe
                </h4>
                <p className="text-gris text-lg mb-8 leading-relaxed opacity-80">
                  Vous préférez discuter directement ? Envoyez-nous un message sur WhatsApp pour une réponse encore plus rapide.
                </p>
                <Button variant="whatsapp" className="w-full">
                  Chat WhatsApp
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="lg:w-3/5">
              <div className="glass p-10 md:p-16 rounded-[3rem] shadow-2xl relative">
                <div className="absolute -top-12 -right-12 w-64 h-64 glow-blue opacity-10 pointer-events-none" />
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
