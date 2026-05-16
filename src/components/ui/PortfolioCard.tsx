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
      "group relative aspect-[4/3] bg-noir-2 border border-white/5 p-8 rounded-3xl overflow-hidden flex flex-col justify-end transition-all duration-500 hover:border-or/40",
      className
    )}>
      {/* Background Decor */}
      <div className="absolute top-10 right-10 text-6xl opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-125">
        {emoji}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono text-or uppercase tracking-widest">{category}</span>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{status}</span>
        </div>
        
        <h3 className="text-2xl text-white group-hover:text-or transition-colors duration-300">
          {title}
        </h3>
      </div>

      {/* Hover Arrow */}
      <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <ArrowUpRight className="w-5 h-5 text-or" />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir-profond via-transparent to-transparent opacity-60" />
    </div>
  );
};

export default PortfolioCard;
