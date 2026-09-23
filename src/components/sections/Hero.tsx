"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity, Wifi } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";
import { stats } from "@/data/stats";
import { useSettings } from "@/components/SettingsProvider";
import { AfricaIntelligenceMap } from "@/components/africa-map/AfricaIntelligenceMap";

/**
 * Hero YEHI OR Tech — texte à gauche, carte Afrique à droite (3x plus grande).
 *
 * Layout 2 colonnes :
 * - Gauche (40%) : badge, titre, sous-titre, 3 CTAs, stats preview
 * - Droite (60%) : carte Afrique grande et bien visible dans un conteneur
 *   premium style 21st.dev (rounded-3xl, border subtle, glow, header + footer)
 *
 * Sur mobile : stacké (texte au-dessus, carte en-dessous)
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
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-noir-profond via-bleu-nuit to-noir-profond" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-or/10 rounded-full blur-[120px] animate-float" />
        <div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-bleu-electrique/8 rounded-full blur-[150px] animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />
      </div>

      <div className="container-x relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 items-center">

          {/* ============================================================
              COLONNE GAUCHE : Contenu textuel (40%)
              ============================================================ */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-or/15 border border-or/40 text-or font-sans font-bold text-xs uppercase tracking-wider mb-6 animate-pulse-slow"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-or opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-or" />
              </span>
              <Sparkles className="w-4 h-4 text-or shrink-0" />
              Agence digitale augmentée par l'IA · Parakou, Bénin
            </motion.div>

            {/* Titre */}
            <h1 className="font-serif font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15] mb-5">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="block"
              >
                Ta présence numérique
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="block mt-1"
              >
                mérite mieux qu'un
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="block mt-1"
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
                    className="absolute bottom-1 left-0 w-full h-[3px] bg-or rounded-full"
                  />
                </span>
                .
              </motion.span>
            </h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm sm:text-base text-gris-light font-sans leading-relaxed max-w-lg mb-8"
            >
              Sites web, applications, agents IA, automatisation et crédibilité en ligne.{" "}
              <span className="font-bold text-blanc-creme">Huit métiers, un seul interlocuteur</span>,
              un devis clair avant de commencer.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-col sm:flex-row items-start gap-4 w-full"
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(245, 183, 0, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
              >
                <Link href="/contact" className="btn-primary btn-shimmer">
                  Demander un devis
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </motion.div>
              <Link
                href="/services"
                className="rounded-full px-6 py-3 font-sans font-bold text-sm text-blanc-creme border border-or/40 hover:bg-or/10 hover:text-or transition-all duration-300"
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
                WhatsApp
              </a>
            </motion.div>

            {/* Stats preview */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 text-xs text-gris font-sans"
            >
              <span className="font-bold text-or">{statsValue}{statsSuffix}</span> services numériques couverts · {stats[2]?.value}{stats[2]?.suffix} délai de réponse garanti
            </motion.p>
          </div>

          {/* ============================================================
              COLONNE DROITE : Africa Intelligence Map (60%)
              Carte 3x plus grande, dans un conteneur premium style 21st.dev
              ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Conteneur premium style 21st.dev */}
            <div className="relative rounded-3xl border border-or/15 bg-noir-2/60 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Glow border top */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />

              {/* Header style dashboard */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-or/10 bg-noir-3/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  </div>
                  <span className="ml-2 font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
                    africa-intelligence-map.tsx
                  </span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-success/10 border border-success/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-success">
                    Live
                  </span>
                </div>
              </div>

              {/* Carte Afrique — pleine largeur du conteneur */}
              <div className="relative p-4">
                <AfricaIntelligenceMap
                  height={560}
                  mobileHeight={400}
                  enableHover
                  enableBeninDetails
                  showCities
                  showConnections
                  variant="hero"
                />
              </div>

              {/* Footer style dashboard */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-or/10 bg-noir-3/50">
                <div className="flex items-center gap-4 text-[11px] font-sans font-bold text-gris-light">
                  <span><span className="text-or">8+</span> solutions</span>
                  <span className="text-gris-dark">·</span>
                  <span><span className="text-or">04</span> marchés</span>
                  <span className="text-gris-dark">·</span>
                  <span><span className="text-or">24</span> clients</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3 w-3 text-success" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-success">
                    Systems Operational
                  </span>
                </div>
              </div>
            </div>

            {/* Glow extérieur */}
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br from-or/10 via-transparent to-bleu-electrique/10 blur-xl" />
          </motion.div>
        </div>
      </div>

      {/* Divider diagonal */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-noir-profond z-10" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
    </section>
  );
}
