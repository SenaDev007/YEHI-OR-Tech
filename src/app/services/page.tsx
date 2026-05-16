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
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            tag="Nos Services"
            title="Une couverture complète de vos besoins numériques"
            subtitle="De la conception graphique au SaaS, du marketing digital à l'agent IA — nous construisons des solutions qui propulsent votre entreprise."
          />
        </div>
      </section>

      {/* Services List */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-24">
            {services.map((service, index) => {
              const IconComponent = (Icons as any)[service.icon] || Icons.HelpCircle;
              
              return (
                <div 
                  key={service.slug}
                  id={service.slug}
                  className={cn(
                    "flex flex-col lg:flex-row gap-16 items-center",
                    index % 2 !== 0 && "lg:flex-row-reverse"
                  )}
                >
                  {/* Visual/Card */}
                  <div className="lg:w-1/2 w-full">
                    <div 
                      className="aspect-video rounded-[40px] p-12 flex items-center justify-center relative overflow-hidden group shadow-2xl"
                      style={{ background: service.gradient }}
                    >
                      <div className="absolute inset-0 bg-noir-profond/20 group-hover:bg-noir-profond/10 transition-colors" />
                      <IconComponent className="w-32 h-32 text-white/20 group-hover:text-white/40 transition-all duration-500 group-hover:scale-110" />
                      
                      <div className="absolute bottom-10 left-10 right-10">
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-mono text-white/80 uppercase tracking-widest">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-or/10 flex items-center justify-center text-or">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-mono text-or font-bold uppercase tracking-widest">Service {index + 1}</span>
                    </div>

                    <h2 className="text-white mb-6">{service.title}</h2>
                    <p className="text-lg text-gris leading-relaxed mb-8">
                      {service.fullDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                      <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest font-mono">Livrables</h4>
                        <ul className="space-y-3">
                          {service.deliverables.map(item => (
                            <li key={item} className="flex items-start gap-2 text-gris text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-or mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest font-mono">Bénéfices</h4>
                        <ul className="space-y-3">
                          {service.benefits.map(item => (
                            <li key={item} className="flex items-start gap-2 text-gris text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button className="group">
                      Demander un devis pour ce service
                      <Icons.ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
