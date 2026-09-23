"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";
import { stats } from "@/data/stats";
import { useSettings } from "@/components/SettingsProvider";
import { AfricaIntelligenceMap } from "@/components/africa-map/AfricaIntelligenceMap";

/**
 * Hero style Win Agro adapté palette YEHI OR Tech avec Africa Intelligence Map.
 *
 * Layout :
 * - Desktop : 2 colonnes (texte à gauche, carte Afrique glass panel à droite)
 * - Mobile : stacké (texte puis carte)
 *
 * La carte Afrique est servie dans un glass panel semi-transparent
 * sur fond bleu-nuit, avec halos or/bleu, badge pulse-slow or,
 * titre serif avec underline or animée, boutons rounded-full + shimmer.
 *
 * Sous la carte : "AFRICA NETWORK · LIVE" + stats live + status indicator.
 */
export function Hero() {
  const statsValue = stats[0]?.value ?? 8;
  const statsSuffix = stats[0]?.suffix ?? "+";
  const { settings } = useSettings();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-noir-profond text-blanc-creme"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-noir-profond via-bleu-nuit to-noir-profond" />
        {/* Cercles flottants */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-or/15 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-bleu-electrique/10 rounded-full blur-[150px] animate-float"
          style={{ animationDelay: "2s" }}
        />
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        <div className="absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />
      </div>

      <div className="container-x relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          {/* Colonne gauche : texte */}
          <div className="flex flex-col items-start text-left">
            {/* Badge pulse-slow or */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-or/15 border border-or/40 text-or font-sans font-bold text-xs uppercase tracking-wider mb-8 animate-pulse-slow"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-or opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-or" />
              </span>
              <Sparkles className="w-4 h-4 text-or shrink-0" />
              Agence digitale augmentée par l'IA · Parakou, Bénin
            </motion.div>

            {/* Titre H1 avec underline or animée */}
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="block"
              >
                Innovation digitale
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="block mt-2"
              >
                pour une Afrique
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
                className="block mt-2"
              >
                plus{" "}
                <span className="relative inline-block text-or font-black">
                  lumineuse
                  <motion.span
                    animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
                    className="absolute bottom-1 left-0 w-full h-[4px] bg-or rounded-full"
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
              className="text-base sm:text-lg text-gris-light font-sans leading-relaxed max-w-xl mb-10 text-pretty"
            >
              Sites web, applications, agents IA, automatisation et crédibilité en ligne.
              {" "}
              <span className="font-bold text-blanc-creme">Huit métiers, un seul interlocuteur</span>,
              un devis clair avant de commencer.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-start gap-5 w-full sm:w-auto"
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(245, 183, 0, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
              >
                <Link href="/contact" className="btn-primary btn-shimmer">
                  Découvrir nos solutions
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </Link>
              </motion.div>

              <a
                href={whatsappLink(undefined, undefined, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp btn-shimmer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Nous contacter
              </a>
            </motion.div>

            {/* Stats preview */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-12 text-sm text-gris font-sans"
            >
              <span className="font-bold text-or">{statsValue}{statsSuffix}</span> services numériques couverts · {stats[2]?.value}{stats[2]?.suffix} délai de réponse garanti
            </motion.p>
          </div>

          {/* Colonne droite : Africa Intelligence Map dans un glass panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glass-panel rounded-3xl p-6 shadow-gold-glow">
              {/* Header de la carte */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-serif text-base font-bold text-blanc-creme tracking-wide">
                    Africa Intelligence Map
                  </p>
                  <p className="text-[10px] font-sans uppercase tracking-widest text-gris">
                    Regional activity &amp; tech footprint
                  </p>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-success/15 border border-success/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-success">
                    Live
                  </span>
                </div>
              </div>

              {/* Carte */}
              <div className="relative">
                <AfricaIntelligenceMap
                  height={500}
                  mobileHeight={360}
                  enableHover
                  enableBeninDetails
                  showCities
                  showConnections
                />
              </div>

              {/* Footer live system */}
              <div className="mt-4 pt-4 border-t border-gris-dark/30">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-sans font-bold uppercase tracking-widest text-gris">
                    Africa Network
                  </span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gris-light font-sans">
                    <span><span className="font-bold text-or">8+</span> solutions</span>
                    <span className="text-gris-dark">·</span>
                    <span><span className="font-bold text-or">04</span> marchés</span>
                    <span className="text-gris-dark">·</span>
                    <span><span className="font-bold text-or">24</span> clients</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Activity className="h-3 w-3 text-success" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-success">
                    Systems Operational
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider diagonal */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-noir-profond" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
    </section>
  );
}
