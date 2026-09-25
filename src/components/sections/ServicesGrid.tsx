"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { useContent } from "@/lib/use-content";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/animations";
import type { Service } from "@/data/services";

/**
 * Section Services — grille 4×2 style Win Agro adaptée palette YEHI OR Tech.
 *
 * Charge les services depuis l'API (contenu éditable depuis /manager/services-content).
 * Si l'API est injoignable ou vide → fallback sur les données statiques
 * src/data/services.ts (graceful degradation).
 */
function loadStaticServices() {
  return import("@/data/services").then((m) => m.services);
}

export function ServicesGrid() {
  const { data: services, usingFallback } = useContent<Service[]>("/api/leads/services", loadStaticServices);

  if (!services || services.length === 0) {
    return (
      <section id="services" className="relative py-24 md:py-32 bg-noir-profond" aria-labelledby="services-title">
        <div className="container-x relative">
          <SectionHeader
            tag="Nos services"
            title="Huit pôles. Un seul interlocuteur."
            description="Chargement des services en cours…"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="relative py-24 md:py-32 bg-noir-profond" aria-labelledby="services-title">
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />
      <div className="absolute inset-0 halo-or opacity-50 pointer-events-none" />

      <div className="container-x relative">
        <SectionHeader
          tag="Nos services"
          title="Huit pôles. Un seul interlocuteur."
          description="Des besoins numériques du quotidien aux systèmes sur mesure. Chaque pôle correspond à un problème réel, avec une disponibilité et un mode de commande clairement indiqués."
        />

        {usingFallback && (
          <div className="mt-4 mb-8 rounded-lg border border-warning/30 bg-warning/5 px-4 py-2 text-center font-sans text-[10px] uppercase tracking-widest text-warning">
            Affichage des données par défaut — le manager peut éditer ce contenu
          </div>
        )}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, idx) => (
            <ServiceCard
              key={service.slug}
              service={service}
              href={`/services/${service.slug}`}
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
            href="/services"
            className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-or link-underline"
          >
            Voir le détail de chaque pôle
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
