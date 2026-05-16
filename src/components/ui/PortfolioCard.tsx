"use client";
 
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Loader2 } from "lucide-react";

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
  emoji,
  status,
  link,
  className
}: PortfolioCardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn(
      "group relative aspect-[16/10] glass rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:bg-white/[0.05]",
      className
    )}>
      {/* Real-time Iframe Preview */}
      <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105 pointer-events-none">
        <div className="w-full h-full bg-noir-2 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-or animate-spin opacity-20" />
            </div>
          )}
          <iframe 
            src={link} 
            className="w-[1280px] h-[800px] origin-top-left scale-[0.3] md:scale-[0.4] lg:scale-[0.5] border-none pointer-events-none"
            onLoad={() => setIsLoading(false)}
            loading="lazy"
            title={title}
          />
        </div>
      </div>

      {/* Background Decor Overlay */}
      <div className="absolute inset-0 bg-noir-profond/60 group-hover:bg-noir-profond/20 transition-colors duration-700 z-10" />

      {/* Emoji Decor (Backup) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] opacity-[0.03] grayscale transition-all duration-1000 group-hover:opacity-0 group-hover:scale-110 z-0">
        {emoji}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
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
        <a 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-10 right-10 w-12 h-12 glass pill flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 delay-100 hover:bg-or hover:text-noir-profond"
        >
          <ArrowUpRight className="w-5 h-5" />
        </a>
      </div>

      {/* Subtle Bottom Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir-profond/90 via-noir-profond/20 to-transparent opacity-100 group-hover:opacity-40 transition-opacity duration-700 z-15" />
    </div>
  );
};

export default PortfolioCard;
