"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";

/**
 * Section CTA final style Win Agro adapté palette YEHI OR Tech :
 * fond bleu-medium, halos or radiaux, boutons rounded-full avec shimmer.
 */
export function CTASection() {
  return (
    <section id="cta-final" className="relative overflow-hidden bg-bleu-medium py-24 md:py-32 text-blanc-creme" aria-labelledby="cta-title">
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full halo-or opacity-80" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-x-1/2 rounded-full halo-bleu opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-30" />

      <div className="container-x relative">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 id="cta-title" className="font-serif text-display-2 font-bold text-blanc-creme text-balance">
            Ton idée mérite d'être construite, pas juste discutée.
          </h2>
          <p className="mt-6 text-lg text-gris-light text-pretty">
            Décris ton projet ou ton besoin. Tu reçois une solution adaptée, un délai
            réaliste et un prix clair, sans engagement de ta part.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(245, 183, 0, 0.45)" }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
            >
              <Link href="/contact" className="btn-primary btn-shimmer">
                Demander un devis gratuit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-shimmer">
              <WhatsAppIcon className="h-4 w-4" />
              Discuter sur WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
