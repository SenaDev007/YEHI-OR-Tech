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
    <section ref={sectionRef} className="py-24 md:py-32 bg-bleu-nuit relative overflow-hidden">
      {/* Background Halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-or/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="max-w-3xl mb-20">
          <Tag>Intelligence Artificielle</Tag>
          <h2 className="text-white mb-6">L'intelligence artificielle au service de votre productivité</h2>
          <p className="text-lg text-gris leading-relaxed">
            Nous aidons les entreprises à intégrer des agents IA et des automatisations 
            concrètes pour répondre plus vite aux clients, gérer les demandes, 
            qualifier les prospects et réduire les tâches répétitives.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="ia-card group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-or/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-or/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <useCase.icon className="w-6 h-6 text-or" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-or transition-colors">
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
