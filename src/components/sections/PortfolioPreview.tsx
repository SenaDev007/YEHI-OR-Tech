"use client";

import React, { useEffect, useRef } from "react";
import Tag from "@/components/ui/Tag";
import PortfolioCard from "@/components/ui/PortfolioCard";
import Link from "next/link";
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-noir-profond relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <Tag>Réalisations</Tag>
            <h2 className="text-white">Nos projets phares</h2>
          </div>
          
          <Link 
            href="/portfolio" 
            className="inline-flex items-center gap-2 text-or font-bold group hover:gap-4 transition-all"
          >
            Voir toutes les réalisations
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div key={index} className="portfolio-reveal">
              <PortfolioCard {...project} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PortfolioPreview;
