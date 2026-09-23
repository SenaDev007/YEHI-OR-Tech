"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { iaUseCases } from "@/data/stats";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/animations";

/**
 * Section IA & Automatisation style Win Agro adapté palette YEHI OR Tech :
 * fond bleu-nuit, halo or central, cartes glassmorphism dark.
 */
export function IASection() {
  return (
    <section id="ia" className="relative overflow-hidden bg-bleu-nuit py-24 md:py-32 text-blanc-creme" aria-labelledby="ia-title">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full halo-or opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-20" />

      <div className="container-x relative">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <span className="inline-flex items-center gap-3 font-sans font-bold text-[10px] uppercase tracking-wider text-or">
            <span className="h-px w-8 bg-or" />
            Intelligence artificielle
          </span>
          <h2 className="mt-4 font-serif text-display-2 font-bold text-blanc-creme text-balance">
            L'IA qui répond pendant que tu travailles ailleurs
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-gris-light text-pretty">
            Des agents et des automatisations qui répondent aux clients, qualifient
            les prospects, publient du contenu et suppriment les tâches répétitives,
            sans que tu aies à y penser chaque jour.
          </p>
        </motion.div>

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
              className="card-shimmer group rounded-2xl border border-or/20 bg-bleu-medium/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-or/40 hover:bg-bleu-medium/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-or/30 bg-or/10 transition-transform duration-500 group-hover:scale-110">
                <span className="text-2xl" aria-hidden>{useCase.emoji}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-blanc-creme transition-colors duration-300 group-hover:text-or">
                {useCase.label}
              </h3>
              <p className="mt-2 text-sm text-gris-light text-pretty">{useCase.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
