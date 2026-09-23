"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { portfolioFilters } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type PortfolioGridClientProps = {
  projects: Project[];
};

/**
 * Grille portfolio avec filtres animés.
 * Filtres : Tous · Sites web · Applications · Design · Agents IA · Automatisation · Crédibilité
 */
export function PortfolioGridClient({ projects }: PortfolioGridClientProps) {
  const [activeFilter, setActiveFilter] = useState("tous");

  // Mapping categorySlug → valeur filtre (les projets sont taggés via categorySlug)
  // Pour cette V1 on garde un filtre simple : Tous + Applications + Design (les vrais statuts)
  const filteredProjects =
    activeFilter === "tous"
      ? projects
      : activeFilter === "applications"
      ? projects.filter((p) => p.categorySlug === "applications")
      : activeFilter === "design"
      ? projects.filter((p) => p.categorySlug === "design")
      : projects;

  return (
    <>
      {/* Filtres */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {portfolioFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-300",
              activeFilter === filter.value
                ? "border-or bg-or/10 text-or"
                : "border-gris-dark/30 text-gris hover:border-or/30 hover:text-blanc-creme"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Grille */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <PortfolioCard project={project} index={idx} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Note transparence */}
      <p className="mt-12 text-center text-xs text-gris italic max-w-2xl mx-auto text-pretty">
        Aucun projet présenté comme "livré" tant qu'il ne l'est pas. La transparence sur le statut "en développement" est elle-même un argument de crédibilité.
      </p>
    </>
  );
}
