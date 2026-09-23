"use client";

import Link from "next/link";
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
 * Carte pack tarifaire — clip-path angulaire, prix display, hover glow or.
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
        "card-base corner-decor relative flex flex-col p-8",
        pack.recommended && "shadow-gold-glow",
        colors.card
      )}
    >
      {/* Badge flottant "Recommandé" */}
      {pack.recommended && (
        <span className="badge-clip absolute -top-3 right-6 bg-or px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-noir-profond">
          Recommandé
        </span>
      )}

      {/* Badge catégorie */}
      {pack.badge && (
        <span
          className={cn(
            "badge-clip self-start px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest",
            colors.badge
          )}
        >
          {pack.badge}
        </span>
      )}

      {/* Nom + tagline */}
      <h3 className="mt-6 font-display text-3xl font-medium text-blanc-creme">
        {pack.name}
      </h3>
      <p className="mt-2 text-sm text-gris-light text-pretty">{pack.tagline}</p>

      {/* Prix */}
      <div className="mt-6 flex items-baseline gap-2">
        <span className={cn("font-display text-5xl font-medium", colors.price)}>
          {formatPrice(pack.price)}
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-gris">
          {pack.currency}
        </span>
      </div>

      {/* Délai + support */}
      {pack.deliveryTime && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-gris">
          ⏱ Livraison : {pack.deliveryTime}
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

      {/* Détails étendus si présents (page /tarifs) */}
      {pack.featureDetails && pack.featureDetails.length > 0 && (
        <div className="mt-6 border-t border-gris-dark/30 pt-6">
          <ul className="flex flex-col gap-3">
            {pack.featureDetails.map((detail) => (
              <li key={detail.label} className="text-xs text-gris">
                <span className="font-mono uppercase tracking-wider text-or">
                  {detail.label}
                </span>
                <span className="ml-2 text-gris-light">{detail.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/contact?service=${encodeURIComponent(pack.id)}`}
        className="btn-primary mt-8 w-full"
      >
        {pack.cta}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </motion.div>
  );
}
