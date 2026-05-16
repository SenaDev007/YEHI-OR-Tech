"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import PortfolioCard from "@/components/ui/PortfolioCard";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const categories = ["Tous", "Sites Web", "Applications SaaS", "Design", "Agents IA", "Automatisation", "Crédibilité"];

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredProjects = projects.filter(project => 
    activeCategory === "Tous" || project.category === activeCategory
  );

  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-64 pb-32 relative overflow-hidden">
        {/* Background Halos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="Showcase"
            title="Nos réalisations"
            subtitle="Explorez notre portfolio de solutions digitales conçues pour transformer l'ambition en impact réel."
          />
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 right-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Portfolio</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-32">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full border text-[10px] font-mono uppercase tracking-[0.3em] transition-all duration-500",
                  activeCategory === cat 
                    ? "bg-white border-white text-noir-profond font-bold shadow-[0_20px_40px_rgba(255,255,255,0.1)]" 
                    : "border-white/10 text-gris-dark hover:border-white/30 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={cn(
                  "animate-in fade-in slide-in-from-bottom-12 duration-1000",
                  index % 2 === 1 ? "md:mt-32" : ""
                )}
              >
                <PortfolioCard 
                  title={project.title}
                  category={project.category}
                  emoji={project.emoji}
                  status={project.status === "live" ? "Actif" : "En développement"}
                />
                
                <div className="mt-10 px-4">
                  <p className="text-xl text-gris leading-relaxed mb-6 line-clamp-2 opacity-80">{project.description}</p>
                  <div className="flex flex-wrap gap-4">
                    {project.tech.map(t => (
                      <span key={t} className="text-[10px] font-mono text-or uppercase tracking-[0.3em]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-48">
              <p className="text-2xl text-gris opacity-50">Aucun projet trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
};

export default PortfolioPage;
