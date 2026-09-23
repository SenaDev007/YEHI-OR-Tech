"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/stats";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/animations";

/**
 * Barre de stats style Win Agro : 4 métriques animées, fond cream avec halos.
 */
export function StatsBar() {
  return (
    <section className="relative py-16 bg-cream overflow-hidden" aria-label="Chiffres clés">
      {/* Halos décoratifs */}
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-primary-green/10 rounded-full blur-[100px]" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 bg-accent-yellow/5 rounded-full blur-[120px]" />

      <div className="container-x relative">
        <motion.dl
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="flex flex-col items-center text-center relative"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-serif text-5xl font-bold text-gradient-green md:text-6xl">
                  {stat.value === 0 ? (
                    stat.label.split(" ")[0]
                  ) : (
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  )}
                </span>
                <span className="mt-2 block font-sans text-[11px] font-bold uppercase tracking-widest text-primary-deep">
                  {stat.value === 0 ? stat.label.split(" ").slice(1).join(" ") : stat.label}
                </span>
              </dd>

              {/* Séparateur vertical vert */}
              {idx < stats.length - 1 && (
                <span className="absolute right-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-primary-green/20 md:block" />
              )}
            </motion.div>
          ))}
        </motion.dl>

        <motion.p
          variants={fadeInUp}
          className="mt-10 max-w-3xl mx-auto text-center text-sm text-gray-text text-pretty"
        >
          {stats[3].meaning}
        </motion.p>
      </div>
    </section>
  );
}
