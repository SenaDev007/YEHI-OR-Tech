"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface PortfolioCardProps {
  title: string;
  category: string;
  emoji: string;
  status: string;
  className?: string;
}

const PortfolioCard = ({
  title,
  category,
  emoji,
  status,
  className
}: PortfolioCardProps) => {
  return (
    <div className={cn(
      "group relative aspect-[16/10] glass rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:bg-white/[0.05]",
      className
    )}>
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-noir-2 transition-transform duration-1000 group-hover:scale-105" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] opacity-[0.03] grayscale transition-all duration-1000 group-hover:opacity-[0.08] group-hover:scale-110">
        {emoji}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-10 flex flex-col justify-end">
        <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-mono text-or uppercase tracking-[0.3em]">{category}</span>
            <div className="w-8 h-px bg-white/20" />
            <span className="text-[10px] font-mono text-gris-dark uppercase tracking-[0.3em]">{status}</span>
          </div>
          
          <h3 className="text-2xl md:text-3xl text-white tracking-tighter uppercase leading-none">
            {title}
          </h3>
        </div>

        {/* Hover Action */}
        <div className="absolute top-10 right-10 w-12 h-12 glass pill flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 delay-100">
          <ArrowUpRight className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Subtle Bottom Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir-profond/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default PortfolioCard;
