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
 * Carte pack tarifaire style Win Agro adaptée palette YEHI OR Tech.
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
        "card-base card-shimmer relative flex flex-col p-8",
        pack.recommended && "shadow-gold-glow",
        colors.card
      )}
    >
      {pack.recommended && (
        <span className="absolute -top-3 right-6 rounded-full bg-or px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-noir-profond">
          Recommandé
        </span>
      )}

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

      <h3 className="mt-6 font-serif text-3xl font-bold text-blanc-creme">{pack.name}</h3>
      <p className="mt-2 text-sm text-gris-light text-pretty">{pack.tagline}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className={cn("font-serif text-5xl font-bold", colors.price)}>{formatPrice(pack.price)}</span>
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-gris">{pack.currency}</span>
      </div>

      {pack.deliveryTime && (
        <p className="mt-3 font-sans text-[11px] font-bold uppercase tracking-wider text-gris-light">
          ⏱ Livraison : {pack.deliveryTime}
          {pack.supportIncluded && ` · ${pack.supportIncluded}`}
        </p>
      )}

      <div className="my-6 h-px w-full bg-gris-dark/30" />

      <ul className="flex flex-1 flex-col gap-3">
        {pack.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-gris-light">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-or" aria-hidden />
            <span className="text-pretty">{feature}</span>
          </li>
        ))}
      </ul>

      {pack.featureDetails && pack.featureDetails.length > 0 && (
        <div className="mt-6 border-t border-gris-dark/30 pt-6">
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

      <Link
        href={`/contact?service=${encodeURIComponent(pack.id)}`}
        className="btn-primary btn-shimmer mt-8 w-full"
      >
        {pack.cta}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </motion.div>
  );
}
