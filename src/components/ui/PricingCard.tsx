"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { slideInLeft, slideInRight, viewportOnce } from "@/lib/animations";
import type { Pack } from "@/data/pricing";
import { formatPrice } from "@/lib/utils";

const colorClasses: Record<NonNullable<Pack["color"]>, { card: string; badge: string; price: string }> = {
  blue: {
    card: "border-bleu-electrique/30",
    badge: "bg-bleu-electrique text-white",
    price: "text-bleu-electrique",
  },
  gold: {
    card: "border-or/40 bg-or/[0.02]",
    badge: "bg-or text-noir-profond",
    price: "text-or",
  },
  dark: {
    card: "border-blanc-creme/10",
    badge: "bg-gris-dark text-blanc-creme",
    price: "text-or",
  },
  green: {
    card: "border-success/30",
    badge: "bg-success text-noir-profond",
    price: "text-or",
  },
};

type PricingCardProps = {
  pack: Pack;
  side: "left" | "right";
};

/**
 * Carte pack tarifaire style Win Agro adapté palette YEHI OR Tech.
 * Le badge "Recommandé" est positionné en haut à l'extérieur de la carte
 * (translate-y-[-50%]) pour qu'il soit entièrement visible (pas coupé
 * par le overflow-hidden de card-shimmer).
 */
export function PricingCard({ pack, side }: PricingCardProps) {
  const colors = colorClasses[pack.color];
  const variants = side === "left" ? slideInLeft : slideInRight;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        "relative flex flex-col p-8 rounded-2xl",
        "bg-noir-2 border transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-glow",
        pack.recommended && "shadow-gold-glow",
        colors.card,
      )}
    >
      {/* Badge flottant "Recommandé" — positionné EN DEHORS de la carte
          (top: -16px) pour ne pas être coupé par overflow-hidden.
          La carte n'a PAS overflow-hidden ici, donc pas de souci. */}
      {pack.recommended && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 rounded-full bg-or px-4 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-noir-profond shadow-lg whitespace-nowrap">
          Recommandé
        </span>
      )}

      {/* Badge catégorie */}
      {pack.badge && (
        <span
          className={cn(
            "rounded-full self-start px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-widest",
            colors.badge
          )}
        >
          {pack.badge}
        </span>
      )}

      {/* Nom + tagline */}
      <h3 className="mt-6 font-serif text-3xl font-bold text-blanc-creme">{pack.name}</h3>
      <p className="mt-2 text-sm text-gris-light text-pretty">{pack.tagline}</p>

      {/* Prix */}
      <div className="mt-6 flex items-baseline gap-2">
        <span className={cn("font-serif text-5xl font-bold", colors.price)}>{formatPrice(pack.price)}</span>
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-gris">{pack.currency}</span>
      </div>

      {/* Délai + support */}
      {pack.deliveryTime && (
        <p className="mt-3 font-sans text-[11px] font-bold uppercase tracking-wider text-gris-light">
          <span className="text-or">Livraison :</span> {pack.deliveryTime}
          {pack.supportIncluded && ` · ${pack.supportIncluded}`}
        </p>
      )}

      {/* Séparateur */}
      <div className="my-6 h-px w-full bg-gris-dark/30" />

      {/* Features */}
      <ul className="flex flex-1 flex-col gap-3">
        {pack.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-gris-light">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-or" aria-hidden />
            <span className="text-pretty">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Détails étendus si présents */}
      {pack.featureDetails && pack.featureDetails.length > 0 && (
        <div className="mt-6 border-t border-gris-dark/30 pt-6 rounded-b-2xl">
          <ul className="flex flex-col gap-3">
            {pack.featureDetails.map((detail) => (
              <li key={detail.label} className="text-xs text-gris">
                <span className="font-sans font-bold uppercase tracking-wider text-or">{detail.label}</span>
                <span className="ml-2 text-gris-light">{detail.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <a
        href={`/contact?service=${encodeURIComponent(pack.id)}`}
        className="btn-primary btn-shimmer mt-8 w-full"
      >
        {pack.cta}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </motion.div>
  );
}
