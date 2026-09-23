"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PricingCard } from "@/components/ui/PricingCard";
import { packs, type PackCategory } from "@/data/pricing";
import { cn } from "@/lib/utils";

type CategoryFilter = {
  label: string;
  value: PackCategory | "tous";
  description: string;
};

const CATEGORIES: CategoryFilter[] = [
  { label: "Tous les packs", value: "tous", description: "Vue d'ensemble de toute la grille tarifaire" },
  { label: "Crédibilité en ligne", value: "credibilite", description: "Emails pro, Google Maps, référencement local, DNS anti-spam" },
  { label: "Sites web", value: "web", description: "Sites vitrines, landing pages, sites institutionnels" },
  { label: "Applications", value: "application", description: "Apps web sur-mesure, dashboards, back-offices" },
  { label: "IA & Automatisation", value: "ia", description: "Agents IA WhatsApp, workflows, automatisations" },
  { label: "Impression", value: "impression", description: "Photocopies, impressions couleur, scan à Parakou" },
];

/**
 * Grille tarifs avec filtres par catégorie.
 * Au clic sur une catégorie, les packs se filtrent avec une transition animée.
 */
export function TarifsGridClient() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(CATEGORIES[0]);

  const filteredPacks =
    activeCategory.value === "tous"
      ? packs
      : packs.filter((p) => p.category === activeCategory.value);

  return (
    <>
      {/* Filtres catégories */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                activeCategory.value === cat.value
                  ? "border-or bg-or/10 text-or"
                  : "border-gris-dark/30 text-gris hover:border-or/30 hover:text-blanc-creme"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-gris-light text-pretty">
          {activeCategory.description}
        </p>
      </div>

      {/* Grille de packs filtrée */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "grid gap-6 md:gap-8",
            // Affichage : 2 colonnes si 2 packs, sinon 3 colonnes
            filteredPacks.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {filteredPacks.map((pack, idx) => (
            <PricingCard
              key={pack.id}
              pack={pack}
              side={idx % 2 === 0 ? "left" : "right"}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredPacks.length === 0 && (
        <div className="text-center py-12 text-gris italic">
          Aucun pack dans cette catégorie pour le moment.
        </div>
      )}
    </>
  );
}
