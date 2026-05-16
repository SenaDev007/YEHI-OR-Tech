"use client";

import React, { useEffect, useRef } from "react";
import Tag from "@/components/ui/Tag";
import PricingCard from "@/components/ui/PricingCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "@/lib/gsap";

const PacksPricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pack-left", {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      gsap.from(".pack-right", {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-noir-profond relative overflow-hidden">
      {/* Side Label */}
      <div className="absolute top-48 right-12 hidden xl:block">
        <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
          <span>Investment</span>
          <div className="w-px h-full bg-gris-dark/20" />
        </div>
      </div>

      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mb-32">
          <Tag>Pricing Packs</Tag>
          <h2 className="text-white mt-8 mb-12 uppercase leading-[0.9]">
            Investissez dans <br />
            <span className="text-gradient-or italic">votre</span> autorité.
          </h2>
          <p className="text-xl md:text-2xl text-gris leading-snug max-w-2xl">
            Des fondations numériques solides conçues pour propulser votre crédibilité 
            et automatiser votre croissance dès le premier jour.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto mb-24">
          <PricingCard 
            className="pack-left"
            name="Pack START"
            price="35 000"
            badge="START"
            badgeColor="bg-noir-3"
            cta="Démarrer maintenant"
            features={[
              "5 adresses email professionnelles",
              "Configuration Google Maps complète",
              "Indexation Google Search Console",
              "Inscription annuaires pro",
              "Sécurité DNS & Anti-spam"
            ]}
          />
          
          <div className="pack-right lg:mt-24">
            <PricingCard 
              name="Pack BUSINESS"
              price="50 000"
              badge="BUSINESS"
              badgeColor="bg-noir-3"
              recommended
              cta="Choisir la puissance"
              features={[
                "25 adresses email professionnelles",
                "Fiche Google Maps premium",
                "Indexation Google Search Console",
                "Inscription annuaires premium",
                "Sécurité DNS & Anti-spam",
                "Support prioritaire 30 jours"
              ]}
            />
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/tarifs" 
            className="group flex items-center justify-center gap-3 text-sm font-mono uppercase tracking-[0.3em] text-gris hover:text-white transition-colors"
          >
            Explorer tous nos services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PacksPricing;
