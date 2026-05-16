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
  className?: string;
}

const ServiceCard = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  tags,
  className 
}: ServiceCardProps) => {
  return (
    <div className={cn(
      "group relative glass p-8 md:p-10 transition-all duration-700 hover:bg-white/[0.06] rounded-[2rem] overflow-hidden flex flex-col h-full",
      className
    )}>
      {/* Background Decor */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-or/5 pill blur-3xl transition-all duration-700 group-hover:bg-or/10 group-hover:scale-110" />
      
      {/* Card Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 glass pill flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:bg-or group-hover:text-noir-profond">
          <Icon className="w-6 h-6 transition-colors duration-500" />
        </div>
        <span className="font-mono text-xs text-gris-dark tracking-[0.3em] uppercase transition-colors duration-500 group-hover:text-or">
          {number}
        </span>
      </div>

      {/* Content */}
      <div className="mt-auto">
        <h3 className="text-2xl text-white mb-4 tracking-tight leading-tight transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gris mb-8 leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-500">
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
