"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Monitor, Zap } from "lucide-react";
import { heroStagger, heroItem, viewportOnce } from "@/lib/animations";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";

/**
 * Hero section — impact immédiat, compréhension en 3 secondes.
 * Composition : eyebrow + titre + sous-titre + 3 CTAs + visuel abstrait.
 */
export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-noir-profond pt-[calc(var(--navbar-height)+2rem)] md:pt-[calc(var(--navbar-height)+4rem)] pb-24"
      aria-label="Section d'accueil"
    >
      {/* Halo or central en fond */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-40 halo-or" />
      {/* Grille or subtile */}
      <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-30 mask-fade-y" />

      <div className="container-x relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Colonne texte */}
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Eyebrow */}
            <motion.div variants={heroItem} className="flex items-center gap-3">
              <span className="h-px w-12 bg-or" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-or">
                Agence digitale augmentée par l'IA · Parakou, Bénin
              </span>
            </motion.div>

            {/* Titre */}
            <motion.h1
              variants={heroItem}
              className="font-display text-display-1 font-medium text-blanc-creme text-balance"
            >
              Ta présence numérique mérite mieux qu'un site vitrine oublié.
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              variants={heroItem}
              className="max-w-2xl text-lg text-gris-light text-pretty"
            >
              Sites web, applications, agents IA, automatisation et crédibilité en ligne.{" "}
              <span className="text-blanc-creme">Huit métiers, un seul interlocuteur</span>,
              un devis clair avant de commencer.
            </motion.p>

            {/* Boutons d'action */}
            <motion.div
              variants={heroItem}
              className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            >
              <Link href="/contact" className="btn-primary">
                Demander un devis
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/services" className="btn-outline">
                Voir nos services
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Écrire sur WhatsApp
              </a>
            </motion.div>
          </motion.div>

          {/* Colonne visuel abstrait */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center aspect-square"
            aria-hidden="true"
          >
            {/* Halo central */}
            <div className="absolute inset-0 rounded-full halo-or opacity-80" />

            {/* Anneau rotatif lent */}
            <div className="hero-ring" />
            <div className="hero-ring" style={{ animationDelay: "-10s", inset: "20px" }} />
            <div className="hero-ring" style={{ animationDelay: "-5s", inset: "40px" }} />

            {/* Point doré central */}
            <div className="relative h-3 w-3 rounded-full bg-or shadow-gold-glow-strong" />

            {/* 3 cartes flottantes */}
            <div className="float-card left-0 top-1/4" style={{ animationDelay: "0s" }}>
              <Bot className="h-5 w-5 text-or" />
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-gris">
                  01
                </span>
                <span className="text-xs font-medium text-blanc-creme">Agent IA</span>
              </div>
            </div>
            <div
              className="float-card right-0 top-1/2"
              style={{ animationDelay: "2s" }}
            >
              <Monitor className="h-5 w-5 text-or" />
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-gris">
                  02
                </span>
                <span className="text-xs font-medium text-blanc-creme">Site Web</span>
              </div>
            </div>
            <div
              className="float-card bottom-1/4 left-1/4"
              style={{ animationDelay: "4s" }}
            >
              <Zap className="h-5 w-5 text-or" />
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-gris">
                  03
                </span>
                <span className="text-xs font-medium text-blanc-creme">Automatisation</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Indicateur de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-gris">
            Défiler
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-or to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
