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
    <section ref={sectionRef} className="py-24 md:py-32 bg-noir-profond relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="max-w-3xl mb-20">
          <Tag>Tarifs</Tag>
          <h2 className="text-white mb-6">Boostez votre crédibilité en ligne</h2>
          <p className="text-lg text-gris leading-relaxed">
            Posez les fondations numériques de votre image de marque 
            avec nos Packs Start et Business. Des solutions clés en main 
            pour être visible et pro dès aujourd'hui.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <PricingCard 
            className="pack-left"
            name="Pack START"
            price="35 000"
            badge="START"
            badgeColor="bg-green-600"
            cta="Choisir le Pack Start"
            features={[
              "5 adresses email professionnelles",
              "Configuration Google Maps (Fiche établissement)",
              "Indexation Google Search Console",
              "Inscription dans 3 annuaires professionnels",
              "Configuration DNS anti-spam (SPF, DKIM)"
            ]}
          />
          
          <PricingCard 
            className="pack-right"
            name="Pack BUSINESS"
            price="50 000"
            badge="BUSINESS"
            badgeColor="bg-or"
            recommended
            cta="Choisir le Pack Business"
            features={[
              "25 adresses email professionnelles",
              "Configuration Google Maps (Fiche établissement)",
              "Indexation Google Search Console",
              "Inscription dans 5 annuaires professionnels",
              "Configuration DNS anti-spam (SPF, DKIM)",
              "Support prioritaire 30 jours"
            ]}
          />
        </div>

        <div className="text-center">
          <Link 
            href="/tarifs" 
            className="inline-flex items-center gap-2 text-or font-bold group hover:gap-4 transition-all"
          >
            Voir tous nos tarifs et packs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PacksPricing;
