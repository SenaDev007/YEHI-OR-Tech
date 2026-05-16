"use client";

import React, { useEffect, useRef } from "react";
import Tag from "@/components/ui/Tag";
import { Bot, MessageSquare, Mail, Share2, Target, Calendar } from "lucide-react";
import gsap from "@/lib/gsap";

const useCases = [
  { icon: Bot, title: "Agent IA WhatsApp 24h/24" },
  { icon: MessageSquare, title: "Assistant client web intégré" },
  { icon: Mail, title: "Automatisation des relances" },
  { icon: Share2, title: "Publication automatique Social" },
  { icon: Target, title: "Qualification de prospects" },
  { icon: Calendar, title: "Prise de rendez-vous" },
];

const IASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ia-card", {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
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
      {/* Background Halos */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] glow-blue opacity-20" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] glow-radial opacity-10" />
      
      {/* Side Label */}
      <div className="absolute top-48 right-12 hidden xl:block">
        <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
          <span>AI Lab</span>
          <div className="w-px h-full bg-gris-dark/20" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="max-w-4xl mb-20">
          <Tag>Artificial Intelligence</Tag>
          <h2 className="text-white mt-8 mb-8 uppercase leading-[0.9]">
            L'IA qui travaille <br />
            <span className="text-gradient-or italic">pour vous</span>, pas l'inverse.
          </h2>
          <p className="text-lg md:text-xl text-gris leading-snug max-w-2xl">
            Nous concevons des agents intelligents sur mesure qui automatisent vos processus 
            critiques et subliment l'expérience de vos clients 24h/24.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="ia-card group glass p-8 rounded-[1.5rem] hover:bg-white/[0.06] transition-all duration-700"
            >
              <div className="w-12 h-12 glass pill flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-or group-hover:text-noir-profond transition-all duration-700">
                <useCase.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl text-white group-hover:text-or transition-colors uppercase tracking-tight leading-none">
                {useCase.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default IASection;
