"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { useContent } from "@/lib/use-content";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/animations";
import type { Stat } from "@/data/stats";

/**
 * Barre de stats style Win Agro adaptée palette YEHI OR Tech :
 * 4 métriques animées, fond noir-2 avec halos or.
 *
 * Charge les stats depuis l'API (éditables depuis /manager/stats-content).
 * Fallback sur src/data/stats.ts en cas d'API injoignable.
 */
function loadStaticStats() {
  return import("@/data/stats").then((m) => m.stats);
}

export function StatsBar() {
  const { data: stats } = useContent<Stat[]>("/api/leads/stats", loadStaticStats);

  if (!stats || stats.length === 0) {
    return <section className="py-16 bg-noir-2" aria-label="Chiffres clés" />;
  }

  return (
    <section className="relative py-16 bg-noir-2 overflow-hidden" aria-label="Chiffres clés">
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-or/10 rounded-full blur-[100px]" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 bg-bleu-electrique/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />

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
              key={stat.label + idx}
              variants={fadeInUp}
              className="flex flex-col items-center text-center relative"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-serif text-5xl font-bold text-gradient-or md:text-6xl">
                  {stat.value === 0 ? (
                    stat.label.split(" ")[0]
                  ) : (
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  )}
                </span>
                <span className="mt-2 block font-sans text-[11px] font-bold uppercase tracking-widest text-gris-light">
                  {stat.value === 0 ? stat.label.split(" ").slice(1).join(" ") : stat.label}
                </span>
              </dd>
              {idx < stats.length - 1 && (
                <span className="absolute right-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-or/20 md:block" />
              )}
            </motion.div>
          ))}
        </motion.dl>

        {stats[stats.length - 1]?.meaning && (
          <motion.p
            variants={fadeInUp}
            className="mt-10 max-w-3xl mx-auto text-center text-sm text-gris text-pretty"
          >
            {stats[stats.length - 1].meaning}
          </motion.p>
        )}
      </div>
    </section>
  );
}
