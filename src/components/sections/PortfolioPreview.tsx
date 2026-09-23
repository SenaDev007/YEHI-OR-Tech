"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { projects } from "@/data/portfolio";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/animations";

/**
 * Section Portfolio Aperçu — 4 cartes projet style Win Agro adapté palette YEHI OR Tech.
 */
export function PortfolioPreview() {
  const previewProjects = projects.slice(0, 4);

  return (
    <section id="portfolio" className="relative py-24 md:py-32 bg-noir-2" aria-labelledby="portfolio-title">
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />
      <div className="absolute inset-0 halo-or opacity-30 pointer-events-none" />

      <div className="container-x relative">
        <SectionHeader
          tag="Réalisations"
          title="Ce qu'on construit en ce moment"
          description="Six marques, un même standard d'exigence. La majorité est encore en construction, on le dit tel quel — la transparence est un argument de crédibilité."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {previewProjects.map((project, idx) => (
            <PortfolioCard
              key={project.id}
              project={project}
              index={idx}
              className="h-full"
            />
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-or link-underline"
          >
            Voir toutes les réalisations
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
