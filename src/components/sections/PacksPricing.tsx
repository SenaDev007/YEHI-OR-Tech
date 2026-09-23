"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PricingCard } from "@/components/ui/PricingCard";
import { packs } from "@/data/pricing";
import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/lib/animations";

/**
 * Section Packs Crédibilité en ligne — style Win Agro adapté palette YEHI OR Tech.
 */
export function PacksPricing() {
  return (
    <section id="tarifs" className="relative py-24 md:py-32 bg-noir-2" aria-labelledby="tarifs-title">
      <div className="absolute inset-0 halo-or opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />

      <div className="container-x relative">
        <SectionHeader
          tag="Tarifs"
          title="Boostez ta crédibilité en ligne"
          description="Pose les fondations numériques de ton image de marque avec nos Packs Start et Business. Prix clairs, livrables précis, sans surprise à la facture."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {packs.map((pack, idx) => (
            <PricingCard
              key={pack.id}
              pack={pack}
              side={idx === 0 ? "left" : "right"}
            />
          ))}
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/tarifs"
            className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-or link-underline"
          >
            Voir tous nos tarifs et packs
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
