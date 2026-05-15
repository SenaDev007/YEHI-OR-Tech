import React from "react";
import { ChevronRight } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-24 bg-midnight relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(20,100,244,0.1)_0%,transparent_70%)]" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[60px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          {/* Subtle Halo */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-electric-blue/10 rounded-full blur-[80px]" />

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Votre projet mérite plus qu'une simple <span className="text-gold">présence</span> en ligne.
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto">
            Donnons-lui une structure, une identité, une technologie et une stratégie capables de produire de vrais résultats.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/devis"
              className="w-full sm:w-auto px-10 py-5 bg-white text-midnight font-bold rounded-2xl hover:bg-gold hover:text-midnight transition-all shadow-xl flex items-center justify-center group"
            >
              Demander un devis
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://wa.me/2290141360803"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center"
            >
              <WhatsAppIcon className="mr-2 w-5 h-5" />
              Discuter sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
