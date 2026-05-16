"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { MessageCircle, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 bg-bleu-medium relative overflow-hidden">
      {/* Background Halos */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-or/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-or/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white mb-8 leading-tight">
            Transformons votre idée<br />
            en solution concrète.
          </h2>
          
          <p className="text-lg md:text-xl text-gris-light mb-12 leading-relaxed max-w-2xl mx-auto">
            Vous avez un projet, un besoin ou une idée numérique ? 
            Décrivez-le nous. Nous vous proposons une solution adaptée, 
            un délai réaliste et un prix transparent.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button size="lg" className="group">
              Demander un devis gratuit
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="whatsapp" size="lg">
              <MessageCircle className="mr-2 w-6 h-6" />
              Discuter sur WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
