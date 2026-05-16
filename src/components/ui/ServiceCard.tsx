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
      "group relative bg-noir-2 border border-white/5 p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:bg-noir-3 overflow-hidden",
      className
    )}>
      {/* Hover Border Accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-or scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      
      {/* Card Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:bg-or/10">
          <Icon className="w-7 h-7 text-or transition-colors duration-500" />
        </div>
        <span className="font-mono text-xs text-white/20 font-bold group-hover:text-or/40 transition-colors duration-500">
          {number}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-2xl text-white mb-4 transition-colors duration-300 group-hover:text-or">
        {title}
      </h3>
      <p className="text-gris mb-8 leading-relaxed text-sm">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span 
            key={tag}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-white/40 uppercase tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;
