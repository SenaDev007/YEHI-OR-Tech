"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";

/**
 * Section CTA final style Win Agro : fond vert foncé, halos jaunes.
 */
export function CTASection() {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden bg-noir-vert py-24 md:py-32 text-white"
      aria-labelledby="cta-title"
    >
      {/* Halos jaunes radiaux */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full halo-yellow opacity-80" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-x-1/2 rounded-full halo-yellow opacity-40" />
      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-10" />

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
            className="font-serif text-display-2 font-bold text-white text-balance"
          >
            Ton idée mérite d'être construite, pas juste discutée.
          </h2>
          <p className="mt-6 text-lg text-gray-200 text-pretty">
            Décris ton projet ou ton besoin. Tu reçois une solution adaptée, un délai
            réaliste et un prix clair, sans engagement de ta part.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(9, 137, 71, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
            >
              <Link href="/contact" className="btn-primary btn-shimmer">
                Demander un devis gratuit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-shimmer"
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
