"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
  image?: string;
  className?: string;
}

const ServiceCard = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  tags,
  image,
  className 
}: ServiceCardProps) => {
  return (
    <div className={cn(
      "group relative glass p-6 md:p-8 transition-all duration-700 hover:bg-white/[0.06] rounded-3xl overflow-hidden flex flex-col h-full",
      className
    )}>
      {/* Background Decor & Image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        {image && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-55 transition-all duration-1000 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-profond via-noir-profond/60 to-noir-profond/10 opacity-90 group-hover:opacity-85 transition-opacity duration-700" />
      </div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-or/5 pill blur-3xl transition-all duration-700 group-hover:bg-or/10 group-hover:scale-110 z-0" />
      
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="w-10 h-10 glass pill flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:bg-or group-hover:text-noir-profond">
          <Icon className="w-5 h-5 transition-colors duration-500" />
        </div>
        <span className="font-mono text-xs text-gris-dark tracking-[0.3em] uppercase transition-colors duration-500 group-hover:text-or">
          {number}
        </span>
      </div>

      {/* Content */}
      <div className="mt-auto relative z-10">
        <h3 className="text-xl text-white mb-3 tracking-tight leading-tight transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gris mb-6 leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="px-4 py-1.5 bg-white/5 pill text-[9px] font-mono text-gris tracking-[0.2em] uppercase border border-white/5 group-hover:border-or/20 transition-all duration-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
