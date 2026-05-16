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
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="Contact"
            title="Parlons de votre projet"
            subtitle="Décrivez votre besoin. Nous vous répondons sous 48h avec une proposition claire et une estimation réaliste."
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Contact Info */}
            <div className="lg:w-2/5 space-y-12">
              <div>
                <h3 className="text-white text-2xl mb-8">Informations de contact</h3>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-or/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-or" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Localisation</h4>
                      <p className="text-gris text-sm leading-relaxed">
                        Parakou, Bénin<br />Afrique de l'Ouest
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-or/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-or" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Email</h4>
                      <p className="text-gris text-sm">contact@yehiortech.com</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-or/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-or" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Disponibilité</h4>
                      <p className="text-gris text-sm">Lun–Sam, 8h–20h (GMT+1)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-noir-2 border border-white/5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  Réponse instantanée
                </h4>
                <p className="text-gris text-sm mb-6 leading-relaxed">
                  Vous préférez discuter directement ? Envoyez-nous un message sur WhatsApp pour une réponse encore plus rapide.
                </p>
                <Button variant="whatsapp" className="w-full">
                  Discuter sur WhatsApp
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="lg:w-3/5">
              <div className="bg-noir-2 border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl relative">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-or/10 blur-[40px] rounded-full" />
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
