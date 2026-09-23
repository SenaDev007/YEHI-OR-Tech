"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { iaUseCases } from "@/data/stats";
import {
  staggerContainer,
  fadeInUp,
  viewportOnce,
} from "@/lib/animations";

/**
 * Section IA & Automatisation — fond bleu-nuit, halo or central.
 * 6 cas d'usage concrets en grille 3×2.
 */
export function IASection() {
  return (
    <section
      id="ia"
      className="relative overflow-hidden bg-bleu-nuit py-24 md:py-32"
      aria-labelledby="ia-title"
    >
      {/* Halo or central */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full halo-or opacity-60" />
      {/* Grille or subtile */}
      <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-20" />

      <div className="container-x relative">
        <SectionHeader
          tag="Intelligence artificielle"
          title="L'IA qui répond pendant que tu travailles ailleurs"
          description="Des agents et des automatisations qui répondent aux clients, qualifient les prospects, publient du contenu et suppriment les tâches répétitives, sans que tu aies à y penser chaque jour."
          align="center"
        />

        {/* Grille 6 cas d'usage */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {iaUseCases.map((useCase, idx) => (
            <motion.article
              key={useCase.label}
              variants={fadeInUp}
              transition={{ delay: (idx % 3) * 0.08 }}
              className="card-base group p-6 transition-all duration-500 hover:border-bleu-electrique/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center border border-bleu-electrique/30 bg-bleu-electrique/10 transition-transform duration-500 group-hover:scale-110">
                <span className="text-2xl" aria-hidden>
                  {useCase.emoji}
                </span>
              </div>
              <h3 className="font-display text-lg font-medium text-blanc-creme transition-colors duration-300 group-hover:text-bleu-electrique">
                {useCase.label}
              </h3>
              <p className="mt-2 text-sm text-gris-light text-pretty">
                {useCase.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
