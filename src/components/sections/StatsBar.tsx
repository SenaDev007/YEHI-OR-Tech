"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/stats";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/animations";

/**
 * Barre de stats — 4 métriques animées au scroll.
 * Séparateurs verticaux or, bordures top/bottom or 10% opacity.
 */
export function StatsBar() {
  return (
    <section
      className="relative border-y border-or/10 bg-noir-2/50 py-12"
      aria-label="Chiffres clés"
    >
      <div className="container-x">
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
              className="flex flex-col items-center text-center"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-5xl font-medium text-gradient-or md:text-6xl">
                  {stat.value === 0 ? (
                    stat.label.split(" ")[0]
                  ) : (
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  )}
                </span>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-widest text-gris-light">
                  {stat.value === 0 ? stat.label.split(" ").slice(1).join(" ") : stat.label}
                </span>
              </dd>

              {/* Séparateur vertical or */}
              {idx < stats.length - 1 && (
                <span className="absolute right-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-or/20 md:block" />
              )}
            </motion.div>
          ))}
        </motion.dl>

        {/* Sous-texte explicatif */}
        <motion.p
          variants={fadeInUp}
          className="mt-10 max-w-3xl mx-auto text-center text-sm text-gris text-pretty"
        >
          {stats[3].meaning}
        </motion.p>
      </div>
    </section>
  );
}
