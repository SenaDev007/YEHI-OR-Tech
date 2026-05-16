"use client";

import React, { useEffect, useRef } from "react";
import Tag from "@/components/ui/Tag";
import gsap from "@/lib/gsap";
import { cn } from "@/lib/utils";

const steps = [
  {
    num: "01",
    title: "Analyse du besoin",
    description: "Comprendre votre activité, vos objectifs et les problèmes à résoudre avant de proposer quoi que ce soit."
  },
  {
    num: "02",
    title: "Proposition de solution",
    description: "Architecture technique, choix des outils, estimation du budget et du délai. Tout est clair avant de démarrer."
  },
  {
    num: "03",
    title: "Design & Architecture",
    description: "Maquettes, structure technique et validation du plan avec vous."
  },
  {
    num: "04",
    title: "Développement",
    description: "Construction de la solution avec rigueur et transparence. Vous suivez l'avancement à chaque étape."
  },
  {
    num: "05",
    title: "Validation client",
    description: "Tests, corrections et validation avec vous avant toute mise en ligne. Zéro surprise."
  },
  {
    num: "06",
    title: "Livraison & Suivi",
    description: "Déploiement et accompagnement post-livraison. Votre succès est notre indicateur."
  }
];

const ProcessSteps = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress line animation
      gsap.fromTo(lineRef.current, 
        { scaleY: 0 },
        { 
          scaleY: 1, 
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 20%",
            end: "bottom 80%",
            scrub: true,
          }
        }
      );

      // Steps reveals
      gsap.from(".step-item", {
        opacity: 0,
        x: (i) => i % 2 === 0 ? -40 : 40,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-noir-profond relative overflow-hidden">
      {/* Side Label */}
      <div className="absolute top-48 left-12 hidden xl:block">
        <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
          <span>Workflow</span>
          <div className="w-px h-full bg-gris-dark/20" />
        </div>
      </div>

      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mb-20">
          <Tag>Process</Tag>
          <h2 className="text-white mt-8 mb-8 uppercase leading-[0.9]">
            Une méthode <br />
            <span className="text-gradient-or italic">éprouvée</span> pour réussir.
          </h2>
          <p className="text-lg md:text-xl text-gris leading-snug max-w-2xl">
            De la stratégie initiale au déploiement final, nous suivons un protocole rigoureux 
            garantissant qualité technique et impact business.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Progress Line */}
          <div className="absolute left-8 md:left-1/2 top-0 -translate-x-1/2 w-px h-full bg-white/5">
            <div 
              ref={lineRef}
              className="w-full h-full bg-or origin-top scale-y-0" 
            />
          </div>

          <div className="space-y-24 md:space-y-48 relative">
            {steps.map((step, index) => (
              <div 
                key={step.num}
                className={cn(
                  "step-item flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-0",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Content Side */}
                <div className="flex-1 w-full px-0 md:px-24">
                  <div className={cn(
                    "flex flex-col",
                    index % 2 === 0 ? "md:items-end md:text-right" : "md:items-start md:text-left"
                  )}>
                    <span className="text-[10px] font-mono text-or uppercase tracking-[0.4em] mb-4">Phase {step.num}</span>
                    <h3 className="text-2xl md:text-3xl text-white mb-6 uppercase tracking-tighter leading-none">{step.title}</h3>
                    <p className="text-gris text-sm md:text-base leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Number Indicator */}
                <div className="relative z-10 flex-shrink-0 ml-4 md:ml-0">
                  <div className="w-12 h-12 glass pill flex items-center justify-center text-white font-display font-medium text-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] group hover:bg-or hover:text-noir-profond transition-all duration-700">
                    {step.num}
                  </div>
                </div>

                {/* Empty Side for balance */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProcessSteps;
