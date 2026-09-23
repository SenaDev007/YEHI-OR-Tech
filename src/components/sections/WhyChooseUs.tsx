"use client";

import { motion } from "framer-motion";
import { MapPin, Bot, Users, Eye, Zap, Smartphone, Globe } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { whyChooseUs } from "@/data/why-choose-us";
import { slideInRight, staggerContainer, fadeInUp, viewportOnce } from "@/lib/animations";

const iconMap = { MapPin, Bot, Users, Eye } as const;
const metricIcons = [Zap, Bot, Smartphone, Globe] as const;

/**
 * Section "Pourquoi nous choisir" — layout 2 colonnes style Win Agro adapté palette YEHI OR Tech.
 * Aucun emoji : uniquement icônes Lucide.
 */
export function WhyChooseUs() {
  return (
    <section
      id="pourquoi-nous"
      className="relative py-24 md:py-32 bg-noir-profond"
      aria-labelledby="why-title"
    >
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />
      <div className="absolute inset-0 halo-bleu opacity-30 pointer-events-none" />

      <div className="container-x relative">
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
                  className="card-base card-shimmer group flex gap-4 p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-or/20 bg-bleu-nuit/50 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-bleu-electrique" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">{arg.number}</span>
                    <h3 className="mt-1 font-serif text-xl font-bold text-blanc-creme transition-colors duration-300 group-hover:text-or">
                      {arg.title}
                    </h3>
                    <p className="mt-2 text-sm text-gris-light text-pretty">{arg.description}</p>
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
            <div className="grid grid-cols-1 gap-4">
              <MetricCard icon={Zap} value="48h" label="Délai de réponse garanti" />
              <MetricCard icon={Bot} value="100%" label="Projets pensés IA d'abord, pas ajoutée après coup" />
              <MetricCard icon={Smartphone} value="Mobile First" label="Conçu pour la 4G et le Mobile Money, pas pour un desktop de bureau" />
              <MetricCard icon={Globe} value="Bénin → Afrique" label="Ancrage local, ambition panafricaine" />
            </div>

            <blockquote className="mt-4 border-l-2 border-or bg-bleu-nuit/30 p-6 rounded-2xl">
              <p className="font-serif text-2xl font-bold italic text-blanc-creme text-pretty">
                « Si une tâche se répète, elle peut tourner toute seule. »
              </p>
              <footer className="mt-4 font-sans text-[11px] font-bold uppercase tracking-widest text-or">
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
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="card-base card-shimmer group flex items-center gap-5 p-5 transition-all duration-300 hover:translate-x-2">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-or/20 bg-bleu-nuit/50">
        <Icon className="h-6 w-6 text-or" />
      </div>
      <div>
        <p className="font-serif text-3xl font-bold text-gradient-or">{value}</p>
        <p className="mt-1 text-sm text-gris-light text-pretty">{label}</p>
      </div>
    </div>
  );
}
