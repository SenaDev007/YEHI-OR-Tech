"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "./Button";

interface PricingCardProps {
  name: string;
  price: string;
  badge: string;
  badgeColor: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  className?: string;
}

const PricingCard = ({
  name,
  price,
  badge,
  badgeColor,
  features,
  cta,
  recommended,
  className
}: PricingCardProps) => {
  return (
    <div className={cn(
      "group relative flex flex-col bg-noir-2 border border-white/5 p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:border-or/40 overflow-hidden",
      recommended && "border-or/20 bg-noir-3 shadow-[0_0_40px_rgba(201,168,76,0.05)]",
      className
    )}>
      {recommended && (
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-or text-noir-profond text-[10px] font-mono font-bold uppercase tracking-widest clip-angular">
          Recommandé
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <span className={cn(
          "inline-block px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-white mb-6 clip-angular",
          badgeColor
        )}>
          {badge}
        </span>
        <h3 className="text-3xl text-white mb-2">{name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-display font-bold text-or">{price}</span>
          <span className="text-gris text-sm font-mono">FCFA</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex-grow space-y-4 mb-10">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-or/10 flex items-center justify-center">
              <Check className="w-3 h-3 text-or" />
            </div>
            <span className="text-gris-light text-sm leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button 
        variant={recommended ? "primary" : "outline"} 
        className="w-full group/btn"
      >
        {cta}
        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default PricingCard;
