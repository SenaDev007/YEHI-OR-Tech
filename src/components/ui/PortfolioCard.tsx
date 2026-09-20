"use client";
/* eslint-disable @next/next/no-img-element */
 
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Loader2, Radio } from "lucide-react";

interface PortfolioCardProps {
  title: string;
  category: string;
  emoji: string;
  status: string;
  link: string;
  className?: string;
}

const PortfolioCard = ({
  title,
  category,
  status,
  link,
  className
}: PortfolioCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const isLive = status === "Actif";

  return (
    <div className={cn(
      "group relative aspect-[16/10] rounded-[2.5rem] overflow-hidden transition-all duration-700 border border-white/5 hover:border-white/10",
      className
    )}>
      {/* Real-time Preview (Bypassing X-Frame-Options via Screenshot API) */}
      <div className="absolute inset-0 z-0 transition-all duration-1000 group-hover:scale-105 pointer-events-none overflow-hidden bg-noir-2">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-or animate-spin opacity-30" />
          </div>
        )}
        <div className="absolute top-0 left-0 w-full h-full">
          <img 
            src={`https://image.thum.io/get/width/1280/crop/800/noanimate/${link}`} 
            alt={`Aperçu en temps réel de ${title}`}
            className="w-full h-full object-cover object-top opacity-0 transition-opacity duration-500"
            onLoad={(e) => {
              setIsLoading(false);
              (e.target as HTMLImageElement).classList.remove('opacity-0');
            }}
            loading="lazy"
          />
        </div>
      </div>

      {/* Strong bottom gradient for text readability — always visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />

      {/* Top scrim for the status badge */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10 pointer-events-none" />

      {/* Status Badge — Top left */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
        <Radio className={cn("w-2.5 h-2.5", isLive ? "text-green-400 animate-pulse" : "text-or")} />
        <span className={cn("text-[9px] font-mono uppercase tracking-[0.25em]", isLive ? "text-green-300" : "text-or")}>
          {status}
        </span>
      </div>

      {/* Hover Action — Top right */}
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 hover:bg-or hover:border-or hover:text-noir-profond"
      >
        <ArrowUpRight className="w-4 h-4" />
      </a>

      {/* Content Overlay — Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        {/* Category */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[9px] font-mono text-or uppercase tracking-[0.35em]">{category}</span>
          <div className="flex-1 h-px bg-white/10 max-w-[40px]" />
        </div>

        {/* Title with text-shadow for maximum legibility */}
        <h3 
          className="text-2xl md:text-3xl font-semibold text-white tracking-tight uppercase leading-none"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7)" }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
};

export default PortfolioCard;
