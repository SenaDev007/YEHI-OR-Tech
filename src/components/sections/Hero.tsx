"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { MessageCircle, ArrowRight, Bot, Globe, Zap } from "lucide-react";
import gsap from "@/lib/gsap";
import { motion } from "framer-motion";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".hero-tag", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" })
        .from(titleRef.current, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(subtitleRef.current, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(ctaRef.current, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(visualRef.current, { opacity: 0, scale: 0.9, duration: 1, ease: "power2.out" }, "-=0.8");

      // Floating animations for cards
      gsap.to(".floating-card", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.5,
          from: "random"
        },
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden"
    >
      {/* Background Grids and Halos */}
      <div className="absolute inset-0 grid-pattern opacity-100" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-or/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Content */}
          <div className="lg:w-3/5 text-center lg:text-left">
            <div className="hero-tag">
              <Tag>L'agence digitale de demain</Tag>
            </div>
            
            <h1 
              ref={titleRef}
              className="text-white leading-[1.1] mb-8"
            >
              Donnez de la <span className="text-gradient-or">lumière</span><br />
              à votre présence digitale.
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-lg md:text-xl text-gris-light mb-10 max-w-2xl leading-relaxed"
            >
              Sites web, applications, agents IA, automatisation, marketing digital 
              et crédibilité en ligne — YEHI OR Tech conçoit des solutions 
              numériques concrètes pour les entreprises qui veulent avancer.
            </p>
            
            <div 
              ref={ctaRef}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6"
            >
              <Button size="lg" className="group">
                Demander un devis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg">
                Nos services
              </Button>
              
              <button className="flex items-center gap-2 text-[#25D366] font-bold hover:opacity-80 transition-opacity ml-2">
                <MessageCircle className="w-6 h-6" />
                <span>Discuter sur WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Visual Hero */}
          <div 
            ref={visualRef}
            className="lg:w-2/5 relative h-[400px] w-full"
          >
            {/* Abstract Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-or/20 rounded-full animate-[spin_20s_linear_infinite]">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-or rounded-full shadow-[0_0_15px_rgba(201,168,76,0.8)]" />
            </div>

            {/* Floating Cards */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Card 1: Agent IA */}
              <div className="floating-card absolute top-0 right-10 glass p-5 rounded-2xl w-44 shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-or/20 flex items-center justify-center mb-3">
                  <Bot className="text-or w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono text-or uppercase tracking-widest mb-1">Agent IA</div>
                <div className="text-sm font-bold text-white leading-tight">Support automatisé 24h/24</div>
              </div>

              {/* Card 2: Site Web */}
              <div className="floating-card absolute top-1/2 left-0 -translate-y-1/2 glass p-5 rounded-2xl w-44 shadow-2xl z-20">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                  <Globe className="text-blue-400 w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1">Site Web</div>
                <div className="text-sm font-bold text-white leading-tight">Expérience premium & rapide</div>
              </div>

              {/* Card 3: Automation */}
              <div className="floating-card absolute bottom-0 right-0 glass p-5 rounded-2xl w-44 shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
                  <Zap className="text-purple-400 w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1">Workflow</div>
                <div className="text-sm font-bold text-white leading-tight">Automatisation intelligente</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-[1px] h-12 bg-gradient-to-b from-or/50 to-transparent overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-or"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
