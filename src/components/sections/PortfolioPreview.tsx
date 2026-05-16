"use client";

import React, { useEffect, useRef } from "react";
import Tag from "@/components/ui/Tag";
import PortfolioCard from "@/components/ui/PortfolioCard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import gsap from "@/lib/gsap";

const projects = [
  {
    title: "Academia Helm",
    category: "Application SaaS",
    emoji: "🎓",
    status: "En développement"
  },
  {
    title: "MédiHelm",
    category: "Application SaaS",
    emoji: "💊",
    status: "En développement"
  },
  {
    title: "NumériSeal Bénin",
    category: "Civic Tech",
    emoji: "🛡️",
    status: "En développement"
  },
  {
    title: "AfriBayit",
    category: "Proptech",
    emoji: "🏠",
    status: "En développement"
  }
];

const PortfolioPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".portfolio-reveal", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
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
          <span>Our works</span>
          <div className="w-px h-full bg-gris-dark/20" />
        </div>
      </div>

      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
          <div className="max-w-4xl">
            <Tag>Featured Works</Tag>
            <h2 className="text-white mt-8 uppercase leading-[0.9]">
              Façonner le <br />
              <span className="text-gradient-or italic">futur</span> digital.
            </h2>
          </div>
          
          <Link 
            href="/portfolio" 
            className="group flex items-center gap-3 text-sm font-mono uppercase tracking-[0.2em] text-gris hover:text-white transition-colors"
          >
            Tous nos travaux
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={cn(
                "portfolio-reveal h-full",
                index % 2 === 1 ? "md:mt-32" : ""
              )}
            >
              <PortfolioCard {...project} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PortfolioPreview;
