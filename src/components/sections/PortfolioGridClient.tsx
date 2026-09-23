"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { getVisibleProjects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Grille portfolio en marquee défilant (style Win Agro).
 * - Première rangée : défile de droite vers la gauche (marquee)
 * - Deuxième rangée : défile de gauche vers la droite (marquee-right)
 * - Alternance si plus de cartes
 *
 * Les cartes sont dupliquées pour créer un effet infini.
 */
export function PortfolioGridClient() {
  const allProjects = getVisibleProjects();

  if (allProjects.length === 0) {
    return (
      <div className="text-center py-12 text-gris italic">
        Aucun projet en production pour le moment.
      </div>
    );
  }

  // Si 3 cartes ou moins, pas besoin de marquee — affichage normal
  if (allProjects.length <= 3) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allProjects.map((project, idx) => (
          <PortfolioCard key={project.id} project={project} index={idx} className="h-full" />
        ))}
      </div>
    );
  }

  // Sinon, split en 2 rangées et active le marquee
  const midIndex = Math.ceil(allProjects.length / 2);
  const row1 = allProjects.slice(0, midIndex);
  const row2 = allProjects.slice(midIndex);

  return (
    <div className="space-y-6">
      {/* Rangée 1 : marquee R→L (défile vers la gauche) */}
      <MarqueeRow projects={row1} direction="left" />

      {/* Rangée 2 : marquee L→R (défile vers la droite) */}
      <MarqueeRow projects={row2} direction="right" />

      {/* Note transparence */}
      <p className="text-center text-xs text-gris italic max-w-2xl mx-auto text-pretty">
        Aucun projet présenté comme « livré » tant qu'il ne l'est pas. La transparence sur le statut « en développement » est elle-même un argument de crédibilité.
      </p>
    </div>
  );
}

function MarqueeRow({
  projects,
  direction,
}: {
  projects: Project[];
  direction: "left" | "right";
}) {
  // Duplique les projets pour le scroll infini
  const duplicated = [...projects, ...projects];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient fade aux extrémités pour un effet "fondu" */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-noir-2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-noir-2 to-transparent" />

      <div
        className={cn(
          "flex gap-6 w-max",
          direction === "left" ? "animate-marquee" : "animate-marquee-right"
        )}
      >
        {duplicated.map((project, idx) => (
          <div
            key={`${project.id}-${idx}`}
            className="w-[300px] sm:w-[340px] shrink-0"
          >
            <PortfolioCard project={project} index={idx} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
