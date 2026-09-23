"use client";

import Link from "next/link";
import Image from "next/image";
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
    card: "border-accent-yellow/40 bg-accent-pale/30",
    badge: "bg-accent-yellow text-noir-vert",
    price: "text-primary-green",
  },
  dark: {
    card: "border-primary-pale",
    badge: "bg-primary-deep text-white",
    price: "text-primary-green",
  },
  green: {
    card: "border-success/30",
    badge: "bg-success text-noir-vert",
    price: "text-primary-green",
  },
};

type PricingCardProps = {
  pack: Pack;
  side: "left" | "right";
};

/**
 * Carte pack tarifaire style Win Agro.
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
        pack.recommended && "shadow-[0_20px_60px_rgba(7,107,55,0.2)]",
        colors.card
      )}
    >
      {/* Badge flottant "Recommandé" */}
      {pack.recommended && (
        <span className="absolute -top-3 right-6 rounded-full bg-accent-yellow px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-noir-vert">
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
      <h3 className="mt-6 font-serif text-3xl font-bold text-primary-deep">
        {pack.name}
      </h3>
      <p className="mt-2 text-sm text-gray-text text-pretty">{pack.tagline}</p>

      {/* Prix */}
      <div className="mt-6 flex items-baseline gap-2">
        <span className={cn("font-serif text-5xl font-bold", colors.price)}>
          {formatPrice(pack.price)}
        </span>
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-text">
          {pack.currency}
        </span>
      </div>

      {/* Délai + support */}
      {pack.deliveryTime && (
        <p className="mt-3 font-sans text-[11px] font-bold uppercase tracking-wider text-primary-green">
          ⏱ Livraison : {pack.deliveryTime}
          {pack.supportIncluded && ` · ${pack.supportIncluded}`}
        </p>
      )}

      {/* Séparateur */}
      <div className="my-6 h-px w-full bg-primary-pale" />

      {/* Features */}
      <ul className="flex flex-1 flex-col gap-3">
        {pack.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-gray-text">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-green" aria-hidden />
            <span className="text-pretty">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Détails étendus si présents */}
      {pack.featureDetails && pack.featureDetails.length > 0 && (
        <div className="mt-6 border-t border-primary-pale pt-6">
          <ul className="flex flex-col gap-3">
            {pack.featureDetails.map((detail) => (
              <li key={detail.label} className="text-xs text-gray-text">
                <span className="font-sans font-bold uppercase tracking-wider text-primary-green">
                  {detail.label}
                </span>
                <span className="ml-2 text-gray-text">{detail.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
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
