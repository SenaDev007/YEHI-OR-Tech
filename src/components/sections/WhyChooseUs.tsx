"use client";

import React, { useEffect, useRef } from "react";
import Tag from "@/components/ui/Tag";
import { ShieldCheck, Zap, Globe, Compass, MessageSquare } from "lucide-react";
import gsap from "@/lib/gsap";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Globe,
    title: "Solutions adaptées aux réalités locales",
    description: "Mobile Money, contraintes réseau, usages africains. Nos solutions sont pensées pour ici, pas copiées d'ailleurs."
  },
  {
    icon: Zap,
    title: "IA & Automatisation intégrées",
    description: "Chaque solution intègre nativement l'intelligence artificielle pour maximiser votre productivité sans effort supplémentaire."
  },
  {
    icon: Compass,
    title: "Approche 360° complète",
    description: "Du logo au SaaS, de l'email pro à l'agent IA. Un seul interlocuteur pour tous vos besoins digitaux."
  },
  {
    icon: ShieldCheck,
    title: "Accompagnement transparent",
    description: "Délais clairs, communication directe, suivi régulier. Vous savez toujours où en est votre projet."
  }
];

const metrics = [
  { icon: Zap, value: "48h", label: "Délai de réponse garanti", color: "text-or" },
  { icon: Globe, value: "5+", label: "Pays couverts par nos solutions", color: "text-blue-400" },
  { icon: MessageSquare, value: "100%", label: "Projets avec IA intégrée", color: "text-green-400" },
  { icon: Zap, value: "Mobile First", label: "Toutes nos solutions", color: "text-or" },
];

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reason-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      gsap.from(".metric-card", {
        opacity: 0,
        x: 30,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-noir-profond relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Arguments */}
          <div className="lg:w-1/2">
            <Tag>Pourquoi nous choisir</Tag>
            <h2 className="text-white mb-12">Ce qui nous différencie</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {reasons.map((reason, index) => (
                <div 
                  key={index}
                  className="reason-card group bg-noir-2 border border-white/5 p-6 rounded-2xl hover:border-or/30 transition-all duration-300"
                >
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-or/10 transition-colors">
                      <reason.icon className="w-6 h-6 text-or" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white mb-2 group-hover:text-or transition-colors">{reason.title}</h3>
                      <p className="text-gris text-sm leading-relaxed">{reason.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Metrics & Philosophy */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {metrics.map((metric, index) => (
                <div 
                  key={index}
                  className="metric-card group bg-noir-2 border border-white/5 p-6 rounded-2xl hover:translate-x-2 hover:border-or/30 transition-all duration-300"
                >
                  <metric.icon className={cn("w-6 h-6 mb-4", metric.color)} />
                  <div className="text-3xl font-display font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-xs font-mono text-gris uppercase tracking-widest">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-bleu-nuit/30 border-l-2 border-or p-8 rounded-r-2xl">
              <p className="text-xl italic text-white/90 mb-4 leading-relaxed">
                "Si une tâche est répétitive,<br />
                elle peut être automatisée."
              </p>
              <div className="text-sm font-mono text-or uppercase tracking-[0.2em]">
                — YEHI OR Tech, Philosophie produit
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
