"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/data/services";
import {
  staggerContainer,
  fadeInUp,
  viewportOnce,
} from "@/lib/animations";

/**
 * Section Services — grille 4×2 (desktop), 2×4 (tablette), 1×8 (mobile).
 * Chaque carte : icône + numéro + badge disponibilité + titre + tagline + tags + CTA.
 */
export function ServicesGrid() {
  return (
    <section
      id="services"
      className="section-halo relative py-24 md:py-32"
      aria-labelledby="services-title"
    >
      <div className="container-x">
        {/* En-tête */}
        <SectionHeader
          tag="Nos services"
          title="Huit pôles. Un seul interlocuteur."
          description="Des besoins numériques du quotidien aux systèmes sur mesure. Chaque pôle correspond à un problème réel, avec une disponibilité et un mode de commande clairement indiqués."
        />

        {/* Grille 8 services */}
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

        {/* Lien bas de section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-or link-underline"
          >
            Voir le détail de chaque pôle
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
