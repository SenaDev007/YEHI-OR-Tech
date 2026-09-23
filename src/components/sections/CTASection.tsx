"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";

/**
 * Section CTA final — fond bleu-medium, halos or radiaux.
 * Deux boutons : devis + WhatsApp.
 */
export function CTASection() {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden bg-bleu-medium py-24 md:py-32"
      aria-labelledby="cta-title"
    >
      {/* Halos or radiaux */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full halo-or opacity-60" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-x-1/2 rounded-full halo-or opacity-40" />
      {/* Grille or */}
      <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-30" />

      <div className="container-x relative">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="cta-title"
            className="font-display text-display-2 font-medium text-blanc-creme text-balance"
          >
            Ton idée mérite d'être construite, pas juste discutée.
          </h2>
          <p className="mt-6 text-lg text-gris-light text-pretty">
            Décris ton projet ou ton besoin. Tu reçois une solution adaptée, un délai
            réaliste et un prix clair, sans engagement de ta part.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-primary">
              Demander un devis gratuit
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Discuter sur WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
