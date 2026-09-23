"use client";

import { motion } from "framer-motion";
import { MapPin, Bot, Users, Eye } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { whyChooseUs } from "@/data/why-choose-us";
import {
  slideInLeft,
  slideInRight,
  staggerContainer,
  fadeInUp,
  viewportOnce,
} from "@/lib/animations";

const iconMap = { MapPin, Bot, Users, Eye } as const;

/**
 * Section "Pourquoi nous choisir" — layout 2 colonnes.
 * Gauche : 4 arguments. Droite : 4 metric cards + citation encadrée.
 */
export function WhyChooseUs() {
  return (
    <section
      id="pourquoi-nous"
      className="relative py-24 md:py-32"
      aria-labelledby="why-title"
    >
      <div className="container-x">
        <SectionHeader
          tag="Pourquoi nous choisir"
          title="Ce qui nous différencie"
          description="Quatre arguments, chacun structuré comme un retournement : ce que tu crois probablement, et pourquoi ce n'est pas ce que tu obtiens ici."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Colonne gauche — 4 arguments */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 gap-4"
          >
            {whyChooseUs.map((arg) => {
              const Icon = iconMap[arg.icon as keyof typeof iconMap] ?? Eye;
              return (
                <motion.article
                  key={arg.number}
                  variants={fadeInUp}
                  className="card-base border-top-gold group flex gap-4 p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-or/20 bg-bleu-nuit/50 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-bleu-electrique" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gris">
                      {arg.number}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-medium text-blanc-creme transition-colors duration-300 group-hover:text-or">
                      {arg.title}
                    </h3>
                    <p className="mt-2 text-sm text-gris-light text-pretty">
                      {arg.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Colonne droite — métriques + citation */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-4"
          >
            {/* 4 métriques */}
            <div className="grid grid-cols-1 gap-4">
              <MetricCard
                icon="⚡"
                value="48h"
                label="Délai de réponse garanti"
              />
              <MetricCard
                icon="🤖"
                value="100%"
                label="Projets pensés IA d'abord, pas ajoutée après coup"
              />
              <MetricCard
                icon="📱"
                value="Mobile First"
                label="Conçu pour la 4G et le Mobile Money, pas pour un desktop de bureau"
              />
              <MetricCard
                icon="🌍"
                value="Bénin → Afrique"
                label="Ancrage local, ambition panafricaine"
              />
            </div>

            {/* Citation encadrée */}
            <blockquote className="mt-4 border-l-2 border-or bg-bleu-nuit/30 p-6">
              <p className="font-display text-2xl font-medium italic text-blanc-creme text-pretty">
                « Si une tâche se répète, elle peut tourner toute seule. »
              </p>
              <footer className="mt-4 font-mono text-[11px] uppercase tracking-widest text-or">
                — YEHI OR Tech, philosophie produit
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="card-base group flex items-center gap-5 p-5 transition-all duration-300 hover:translate-x-2">
      <span className="text-3xl" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="font-display text-3xl font-medium text-gradient-or">{value}</p>
        <p className="mt-1 text-sm text-gris-light text-pretty">{label}</p>
      </div>
    </div>
  );
}
