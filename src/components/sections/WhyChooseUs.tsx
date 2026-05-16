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
  { icon: Globe, value: "5+", label: "Pays couverts par nos solutions", color: "text-bleu-electrique" },
  { icon: MessageSquare, value: "100%", label: "Projets avec IA intégrée", color: "text-or-light" },
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
    <section ref={sectionRef} className="section-padding bg-noir-profond relative overflow-hidden">
      {/* Side Label */}
      <div className="absolute top-48 left-12 hidden xl:block">
        <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
          <span>Our philosophy</span>
          <div className="w-px h-full bg-gris-dark/20" />
        </div>
      </div>

      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-24 lg:gap-32">
          
          {/* Left Column: Arguments */}
          <div className="lg:w-1/2">
            <Tag>Philosophy</Tag>
            <h2 className="text-white mt-8 mb-16 uppercase leading-[0.9]">
              L'excellence <br />
              <span className="text-gradient-or italic">comme</span> standard.
            </h2>
            
            <div className="grid grid-cols-1 gap-8">
              {reasons.map((reason, index) => (
                <div 
                  key={index}
                  className="reason-card group glass p-10 rounded-[2rem] hover:bg-white/[0.06] transition-all duration-500"
                >
                  <div className="flex gap-8">
                    <div className="flex-shrink-0 w-16 h-16 glass pill flex items-center justify-center group-hover:bg-or group-hover:text-noir-profond transition-all duration-500">
                      <reason.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl text-white mb-4 group-hover:text-or transition-colors">{reason.title}</h3>
                      <p className="text-gris text-base leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{reason.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Metrics & Philosophy */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
              {metrics.map((metric, index) => (
                <div 
                  key={index}
                  className="metric-card group glass p-10 rounded-[2.5rem] hover:bg-white/[0.06] transition-all duration-700"
                >
                  <metric.icon className={cn("w-8 h-8 mb-8", metric.color)} />
                  <div className="text-5xl font-display font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-[10px] font-mono text-gris-dark uppercase tracking-[0.3em]">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="relative p-12 glass rounded-[2.5rem] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 glow-radial opacity-10" />
              <p className="text-2xl md:text-3xl italic text-white leading-tight mb-8">
                "Si une tâche est répétitive, elle mérite d'être automatisée par l'intelligence."
              </p>
              <div className="text-xs font-mono text-or uppercase tracking-[0.4em]">
                — YEHI OR Studio
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
