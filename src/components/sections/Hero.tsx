"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";
import { useContent } from "@/lib/use-content";
import { useSettings } from "@/components/SettingsProvider";

/**
 * Hero YEHI OR Tech — textes éditables depuis /manager/page-content.
 *
 * PageContent keys utilisées (page=home, section=hero) :
 *  - badge                → texte du badge "Agence digitale…"
 *  - title_line1          → 1ère ligne du titre
 *  - title_line2          → 2e ligne du titre
 *  - title_line3          → 3e ligne du titre
 *  - title_line3_highlight → mot mis en avant dans la 3e ligne (souligné animé)
 *  - subtitle             → 1ère partie du sous-titre
 *  - subtitle_bold        → partie en gras du sous-titre
 *  - subtitle_end         → fin du sous-titre
 *  - cta_primary          → libellé CTA principal
 *  - cta_primary_href     → URL CTA principal
 *  - cta_secondary        → libellé CTA secondaire
 *  - cta_secondary_href   → URL CTA secondaire
 *  - cta_whatsapp         → libellé CTA WhatsApp
 *
 * Fallback : valeurs hardcoded si l'API est vide/injoignable.
 */

const DEFAULTS: Record<string, string> = {
  hero_badge: "Agence digitale augmentée par l'IA · Parakou, Bénin",
  hero_title_line1: "Ta présence numérique",
  hero_title_line2: "mérite mieux qu'un",
  hero_title_line3: "site vitrine",
  hero_title_line3_highlight: "oublié",
  hero_subtitle: "Sites web, applications, agents IA, automatisation et crédibilité en ligne.",
  hero_subtitle_bold: "Huit métiers, un seul interlocuteur",
  hero_subtitle_end: "un devis clair avant de commencer.",
  hero_cta_primary: "Demander un devis",
  hero_cta_primary_href: "/contact",
  hero_cta_secondary: "Voir nos services",
  hero_cta_secondary_href: "/services",
  hero_cta_whatsapp: "Écrire sur WhatsApp",
  hero_image: "https://images.unsplash.com/photo-1460925895977-253fabe57ce8?auto=format&fit=crop&w=1920&q=85",
};

function loadStaticFallback(): Promise<Record<string, string>> {
  return Promise.resolve(DEFAULTS);
}

export function Hero() {
  const { settings } = useSettings();
  const { data } = useContent<Record<string, string>>(
    "/api/leads/page-content?page=home",
    loadStaticFallback
  );

  // Merge defaults + fetched data
  const content: Record<string, string> = {
    ...DEFAULTS,
    ...(data || {}),
  };

  // Stats preview values
  const statsValue = 8;
  const statsSuffix = "+";
  const stat48 = 48;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-noir-profond text-blanc-creme"
    >
      {/* Image professionnelle en background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.hero_image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-noir-profond/90 via-bleu-nuit/85 to-noir-profond/95" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245, 183, 0, 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-or/8 rounded-full blur-[120px] animate-float" />
        <div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-bleu-electrique/6 rounded-full blur-[150px] animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Contenu centré */}
      <div className="container-x relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-or/15 border border-or/40 text-or font-sans font-bold text-xs uppercase tracking-wider mb-8 animate-pulse-slow"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-or opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-or" />
            </span>
            <Sparkles className="w-4 h-4 text-or shrink-0" />
            {content.hero_badge}
          </motion.div>

          {/* Titre — 3 lignes animées, ligne 3 a un mot highlight souligné */}
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.15] mb-6">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="block"
            >
              {content.hero_title_line1}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="block mt-2 text-blanc-creme"
            >
              {content.hero_title_line2}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="block mt-4"
            >
              {content.hero_title_line3}{" "}
              <span className="relative inline-block text-or font-black">
                {content.hero_title_line3_highlight}
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
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-gris-light font-sans leading-relaxed max-w-2xl mb-10"
          >
            {content.hero_subtitle}{" "}
            <span className="font-bold text-blanc-creme">{content.hero_subtitle_bold}</span>,{" "}
            {content.hero_subtitle_end}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(245, 183, 0, 0.45)" }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
            >
              <Link href={content.hero_cta_primary_href || "/contact"} className="btn-primary btn-shimmer">
                {content.hero_cta_primary}
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>
            </motion.div>
            <Link
              href={content.hero_cta_secondary_href || "/services"}
              className="rounded-full px-7 py-3.5 font-sans font-bold text-sm text-blanc-creme border border-or/40 hover:bg-or/10 hover:text-or transition-all duration-300"
            >
              {content.hero_cta_secondary}
            </Link>
            <a
              href={whatsappLink(undefined, undefined, settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-shimmer"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {content.hero_cta_whatsapp}
            </a>
          </motion.div>

          {/* Stats preview */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 text-sm text-gris font-sans"
          >
            <span className="font-bold text-or">{statsValue}{statsSuffix}</span> services numériques couverts · {stat48}h délai de réponse garanti
          </motion.p>
        </div>
      </div>

      {/* Divider diagonal */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-noir-profond z-10" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
    </section>
  );
}
