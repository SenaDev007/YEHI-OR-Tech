"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { MessageCircle, ArrowRight, Bot, Globe, Zap } from "lucide-react";
import Link from "next/link";
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
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="hero-tag mb-8">
            <Tag>Digital Production Studio</Tag>
          </div>
          
          <h1 
            ref={titleRef}
            className="text-white mb-8 uppercase tracking-tighter"
          >
            Des idées <br />
            <span className="text-gradient-or italic font-display">lumineuses</span>,<br />
            des solutions <br />
            brillantes.
          </h1>
          
          <div className="flex flex-col md:flex-row items-end justify-between gap-12">
            <p 
              ref={subtitleRef}
              className="text-lg md:text-xl text-gris max-w-xl leading-snug"
            >
              YEHI OR Tech conçoit des expériences numériques haut de gamme, 
              fusionnant stratégie, design et intelligence artificielle pour 
              propulser votre crédibilité digitale.
            </p>
            
            <div 
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Button size="lg" className="w-full sm:w-auto">
                Lancer un projet
              </Button>
              
              <Link 
                href="/portfolio" 
                className="group flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-gris hover:text-white transition-colors"
              >
                Voir nos travaux
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Abstract Elements */}
        <div 
          ref={visualRef}
          className="absolute top-1/2 right-0 -translate-y-1/2 hidden xl:block w-1/3 h-[600px] pointer-events-none"
        >
          <div className="absolute top-0 right-0 w-64 h-64 glass pill animate-float opacity-20" />
          <div className="absolute bottom-20 right-32 w-48 h-48 border border-or/20 pill animate-float [animation-delay:2s] opacity-30" />
          <div className="absolute top-1/2 left-0 w-32 h-32 bg-or/5 pill blur-2xl animate-float [animation-delay:4s]" />
        </div>

      </div>
      
      {/* Bottom Label (SherAgency Style) */}
      <div className="absolute bottom-12 left-6 hidden md:block">
        <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
          <span>Scroll to explore</span>
          <div className="w-px h-full bg-gris-dark/20" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
