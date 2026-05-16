"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { MessageCircle, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding bg-noir-profond relative overflow-hidden">
      {/* Background Text Decor */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
        <span className="text-[20vw] font-display font-bold whitespace-nowrap leading-none tracking-tighter">
          YEHI OR YEHI OR YEHI OR
        </span>
      </div>

      {/* Side Label */}
      <div className="absolute top-48 left-12 hidden xl:block">
        <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
          <span>Start here</span>
          <div className="w-px h-full bg-gris-dark/20" />
        </div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-white mb-10 uppercase leading-[0.85] tracking-tighter">
            Prêt à <br />
            <span className="text-gradient-or italic">illuminer</span> <br />
            votre marque ?
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button size="lg" className="w-full md:w-auto min-w-[240px]">
              Lancer un projet
            </Button>
            
            <Button variant="outline" size="lg" className="w-full md:w-auto min-w-[240px]">
              Nous contacter
            </Button>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-xs font-mono text-gris uppercase tracking-[0.3em]">Ou directement via</p>
            <a 
              href="https://wa.me/22990000000" 
              className="text-xl font-display text-white hover:text-or transition-colors flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
              WhatsApp Business
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
