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
      "group relative flex flex-col glass p-8 md:p-10 rounded-[2rem] transition-all duration-700 hover:bg-white/[0.06] overflow-hidden h-full",
      recommended && "bg-white/[0.04] border-or/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] scale-[1.02] z-10",
      className
    )}>
      {recommended && (
        <div className="absolute top-8 right-8 px-6 py-1.5 bg-or text-noir-profond text-[9px] font-mono font-bold uppercase tracking-[0.3em] rounded-full">
          Best value
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <span className={cn(
          "inline-block px-4 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-white mb-6 rounded-full border border-white/10",
          badgeColor
        )}>
          {badge}
        </span>
        <h3 className="text-3xl text-white mb-2 uppercase tracking-tighter">{name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-display font-medium text-white tracking-tighter">{price}</span>
          <span className="text-gris-dark text-[10px] font-mono uppercase tracking-widest">FCFA</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex-grow space-y-4 mb-8">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0 w-5 h-5 glass pill flex items-center justify-center group-hover:bg-or group-hover:text-noir-profond transition-all duration-500">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span className="text-gris text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button 
        variant={recommended ? "primary" : "outline"} 
        className="w-full"
      >
        {cta}
      </Button>
    </div>
  );
};

export default PricingCard;
