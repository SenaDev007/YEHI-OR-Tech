import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({ tag, title, subtitle, centered, className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-4xl", centered && "mx-auto text-center", className)}>
      {tag && <p className={cn("eyebrow", centered && "justify-center")}>{tag}</p>}
      <h2 className="mt-6 text-white">{title}</h2>
      {subtitle && <p className={cn("mt-7 max-w-2xl text-lg leading-8 text-white/65", centered && "mx-auto")}>{subtitle}</p>}
    </div>
  );
}
