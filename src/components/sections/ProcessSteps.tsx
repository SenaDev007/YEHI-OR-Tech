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
    <section ref={sectionRef} className="py-24 md:py-32 bg-noir-profond relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="max-w-3xl mb-24 text-center mx-auto">
          <Tag className="justify-center">Notre Processus</Tag>
          <h2 className="text-white">Comment nous travaillons</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-white/10 hidden md:block">
            <div 
              ref={lineRef}
              className="w-full h-full bg-or origin-top scale-y-0" 
            />
          </div>

          <div className="space-y-12 md:space-y-24 relative">
            {steps.map((step, index) => (
              <div 
                key={step.num}
                className={cn(
                  "step-item flex flex-col md:flex-row items-center gap-8 md:gap-0",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Content Side */}
                <div className="flex-1 w-full md:text-right px-0 md:px-12 text-center md:text-left">
                  <div className={cn(
                    "flex flex-col",
                    index % 2 === 0 ? "md:items-end" : "md:items-start"
                  )}>
                    <h3 className="text-2xl text-white mb-4">{step.title}</h3>
                    <p className="text-gris text-sm leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Number Indicator */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-noir-profond border-2 border-or flex items-center justify-center text-or font-display font-bold text-xl shadow-[0_0_20px_rgba(201,168,76,0.3)] group hover:bg-or hover:text-noir-profond transition-colors duration-500">
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
