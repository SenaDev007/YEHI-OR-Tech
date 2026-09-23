"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";
import { stats } from "@/data/stats";

/**
 * Hero style Win Agro : fond couleur primaire avec halo,
 * badge pulse-slow, titre avec underline jaune animée, boutons rounded-full avec shimmer.
 */
export function Hero() {
  const statsValue = stats[0]?.value ?? 8;
  const statsSuffix = stats[0]?.suffix ?? "+";

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-primary-deep text-white"
    >
      {/* Background overlay vert foncé + halos */}
      <div className="absolute inset-0 z-0">
        {/* Mesh gradient vert */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-deep via-primary-deep to-noir-vert" />

        {/* Glowing floating circles — style Win Agro */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-green/20 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-accent-yellow/5 rounded-full blur-[150px] animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* SVG noise grain */}
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none mix-blend-overlay"
        >
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* Grille grain */}
        <div className="absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />
      </div>

      <div className="container-x relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Badge pulse-slow — style Win Agro */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-green/30 border border-primary-green/50 text-accent-yellow font-sans font-bold text-xs uppercase tracking-wider mb-8 animate-pulse-slow"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-yellow opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-yellow" />
            </span>
            <Sparkles className="w-4 h-4 text-accent-yellow shrink-0" />
            Agence digitale augmentée par l'IA · Parakou, Bénin
          </motion.div>

          {/* Titre H1 avec underline jaune animée — style Win Agro */}
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.15] mb-6">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="block"
            >
              Ta présence numérique
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="block mt-2 text-white"
            >
              mérite mieux qu'un
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
              className="block mt-4"
            >
              site vitrine{" "}
              <span className="relative inline-block text-accent-yellow font-black">
                oublié
                <motion.span
                  animate={{
                    scaleX: [0, 1, 1, 0],
                    transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    times: [0, 0.15, 0.85, 1],
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-1 left-0 w-full h-[4px] bg-accent-yellow rounded-full"
                />
              </span>
              .
            </motion.span>
          </h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-gray-200 font-sans leading-relaxed max-w-2xl mb-10"
          >
            Sites web, applications, agents IA, automatisation et crédibilité en ligne.{" "}
            <span className="font-bold text-white">Huit métiers, un seul interlocuteur</span>,
            un devis clair avant de commencer.
          </motion.p>

          {/* CTAs — boutons rounded-full avec shimmer — style Win Agro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(9, 137, 71, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
            >
              <Link href="/contact" className="btn-primary btn-shimmer">
                Demander un devis
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>
            </motion.div>

            <Link href="/services" className="rounded-full px-7 py-3.5 font-sans font-bold text-sm text-white border border-white/30 hover:bg-white/10 transition-all duration-300">
              Voir nos services
            </Link>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-shimmer"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Écrire sur WhatsApp
            </a>
          </motion.div>

          {/* Stats preview — style Win Agro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 text-sm text-gray-300 font-sans"
          >
            <span className="font-bold text-accent-yellow">{statsValue}{statsSuffix}</span> services numériques couverts · {stats[2]?.value}{stats[2]?.suffix} délai de réponse garanti
          </motion.p>
        </div>
      </div>

      {/* Divider diagonal — style Win Agro */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 bg-cream"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </section>
  );
}
