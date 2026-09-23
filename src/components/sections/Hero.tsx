"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";
import { stats } from "@/data/stats";
import { useSettings } from "@/components/SettingsProvider";
import { AfricaIntelligenceMap } from "@/components/africa-map/AfricaIntelligenceMap";

/**
 * Hero YEHI OR Tech — carte Afrique pleine taille en arrière-plan (visible, sans opacité),
 * contenu original centré au premier plan avec voile radial subtil au centre
 * pour la lisibilité du texte.
 *
 * Pas de conteneur glass-panel autour de la carte : la carte est directement
 * en background full-size, avec ses couleurs hero (variant="hero").
 */
export function Hero() {
  const statsValue = stats[0]?.value ?? 8;
  const statsSuffix = stats[0]?.suffix ?? "+";
  const { settings } = useSettings();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-noir-profond text-blanc-creme"
    >
      {/* ============================================================
          LAYER 1 : Background gradient + cercles flottants
          ============================================================ */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-noir-profond via-bleu-nuit to-noir-profond" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-or/10 rounded-full blur-[120px] animate-float" />
        <div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-bleu-electrique/10 rounded-full blur-[150px] animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* ============================================================
          LAYER 2 : Africa Intelligence Map — PLEINE TAILLE, VISIBLE
          Pas d'opacité, pas de conteneur visible.
          La carte est directement en background full-size.
          ============================================================ */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-full h-full">
          <AfricaIntelligenceMap
            height={900}
            mobileHeight={600}
            enableHover
            enableBeninDetails
            showCities
            showConnections
            variant="hero"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Voile radial subtil au centre pour la lisibilité du texte
          (la carte reste pleinement visible en périphérie) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 42% 55% at center, rgba(8, 10, 15, 0.72) 0%, rgba(8, 10, 15, 0.35) 55%, transparent 85%)",
        }}
      />

      {/* ============================================================
          LAYER 3 : Contenu original du Hero (centré par-dessus la carte)
          ============================================================ */}
      <div className="container-x relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

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

          {/* Titre H1 */}
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
              className="block mt-2 text-blanc-creme"
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
              <span className="relative inline-block text-or font-black">
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
            className="text-base sm:text-lg md:text-xl text-gris-light font-sans leading-relaxed max-w-2xl mb-10"
          >
            Sites web, applications, agents IA, automatisation et crédibilité en ligne.{" "}
            <span className="font-bold text-blanc-creme">Huit métiers, un seul interlocuteur</span>,
            un devis clair avant de commencer.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(245, 183, 0, 0.45)" }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
            >
              <Link href="/contact" className="btn-primary btn-shimmer">
                Demander un devis
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>
            </motion.div>

            <Link
              href="/services"
              className="rounded-full px-7 py-3.5 font-sans font-bold text-sm text-blanc-creme border border-or/40 hover:bg-or/10 hover:text-or transition-all duration-300"
            >
              Voir nos services
            </Link>

            <a
              href={whatsappLink(undefined, undefined, settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-shimmer"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Écrire sur WhatsApp
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
      </div>

      {/* Divider diagonal */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-noir-profond z-10" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
    </section>
  );
}
