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
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="Réalisations"
            title="Nos projets phares"
            subtitle="Découvrez comment nous aidons nos clients à transformer leurs idées en solutions numériques concrètes et performantes."
          />
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full border text-sm font-mono uppercase tracking-widest transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-or border-or text-noir-profond font-bold" 
                    : "border-white/10 text-gris hover:border-white/30 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <PortfolioCard 
                  title={project.title}
                  category={project.category}
                  emoji={project.emoji}
                  status={project.status === "live" ? "Actif" : "En développement"}
                />
                
                <div className="mt-6 px-4">
                  <p className="text-gris text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span key={t} className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                        # {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gris">Aucun projet trouvé dans cette catégorie.</p>
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
