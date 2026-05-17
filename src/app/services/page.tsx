"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

const ServicesPage = () => {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-64 pb-32 relative overflow-hidden">
        {/* Background Halos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute inset-0 bg-[url('/images/heroes/services.png')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-noir-profond/60 to-noir-profond" />
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            tag="Expertises"
            title="Une couverture complète de vos besoins numériques"
            subtitle="De la stratégie de marque au déploiement d'agents IA sophistiqués — nous construisons l'infrastructure de votre succès digital."
          />
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Expertises</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-48">
            {services.map((service, index) => {
              const IconComponent = (Icons as any)[service.icon] || Icons.HelpCircle;
              
              return (
                <div 
                  key={service.slug}
                  id={service.slug}
                  className={cn(
                    "flex flex-col lg:flex-row gap-24 items-center",
                    index % 2 !== 0 && "lg:flex-row-reverse"
                  )}
                >
                  {/* Visual/Card */}
                  <div className="lg:w-1/2 w-full">
                    <div className="relative aspect-video glass rounded-[3rem] overflow-hidden group">
                      {service.image ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                          style={{ backgroundImage: `url(${service.image})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="w-48 h-48 text-white opacity-5" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-noir-profond/40 group-hover:bg-noir-profond/20 transition-colors duration-700" />
                      <div className="absolute inset-0 glow-radial opacity-10 group-hover:opacity-20 transition-opacity duration-700 scale-150" />
                      
                      <div className="absolute bottom-12 left-12 right-12 z-10">
                        <div className="flex flex-wrap gap-3">
                          {service.tags.map(tag => (
                            <span key={tag} className="px-4 py-1.5 glass rounded-full text-[9px] font-mono text-white/60 uppercase tracking-[0.3em]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 glass pill flex items-center justify-center text-or">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em]">Expertise {index + 1}</span>
                    </div>

                    <h2 className="text-white mt-4 mb-10 uppercase leading-none tracking-tighter">{service.title}</h2>
                    <p className="text-xl text-gris leading-relaxed mb-12 opacity-80">
                      {service.fullDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-16">
                      <div>
                        <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-[0.3em] font-mono text-gris-dark">Livrables</h4>
                        <ul className="space-y-4">
                          {service.deliverables.map(item => (
                            <li key={item} className="flex items-start gap-3 text-gris text-base">
                              <div className="w-1.5 h-1.5 glass pill bg-or mt-2 flex-shrink-0" />
                              <span className="opacity-80">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-[0.3em] font-mono text-gris-dark">Bénéfices</h4>
                        <ul className="space-y-4">
                          {service.benefits.map(item => (
                            <li key={item} className="flex items-start gap-3 text-gris text-base">
                              <div className="w-1.5 h-1.5 glass pill bg-white/20 mt-2 flex-shrink-0" />
                              <span className="opacity-80">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button className="w-full sm:w-auto">
                      Démarrer un projet
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
};

export default ServicesPage;
