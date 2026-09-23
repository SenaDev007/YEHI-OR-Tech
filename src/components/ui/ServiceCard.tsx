"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import type { Service } from "@/data/services";

type ServiceCardProps = {
  service: Service;
  href: string;
  className?: string;
  index?: number;
};

const availabilityStyles: Record<
  Service["availability"],
  string
> = {
  immediate: "bg-success/15 text-success border-success/30",
  "sur-devis": "bg-or/15 text-or border-or/30",
  produit: "bg-bleu-electrique/15 text-bleu-electrique border-bleu-electrique/30",
};

/**
 * Carte de service — version grille homepage et page services.
 * Hover : translateY, bordure top or animée, icône scale 1.05.
 */
export function ServiceCard({ service, href, className, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: (index % 4) * 0.08 }}
      className={cn("card-base border-top-gold group relative h-full p-6", className)}
    >
      <Link href={href} className="absolute inset-0 z-10" aria-label={service.title} />

      {/* En-tête : numéro + icône + badge disponibilité */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-gris">{service.number}</span>
          <div className="flex h-10 w-10 items-center justify-center border border-or/20 bg-bleu-nuit/50 transition-transform duration-500 group-hover:scale-105">
            <ServiceIconName name={service.icon} />
          </div>
        </div>
        <span
          className={cn(
            "badge-clip border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
            availabilityStyles[service.availability]
          )}
        >
          {service.availabilityLabel}
        </span>
      </div>

      {/* Titre + tagline */}
      <h3 className="mb-3 font-display text-2xl font-medium text-blanc-creme transition-colors duration-300 group-hover:text-or">
        {service.title}
      </h3>
      <p className="mb-5 text-sm text-gris-light text-pretty">{service.tagline}</p>

      {/* Tags */}
      <ul className="mb-5 flex flex-wrap gap-1.5">
        {service.tags.map((tag) => (
          <li
            key={tag}
            className="border border-gris-dark/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gris"
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-or opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {service.cta}
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-or opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1"
          aria-hidden
        />
      </div>
    </motion.div>
  );
}

/**
 * Mapping icône nom → composant lucide-react.
 * Évite d'importer dynamiquement les icônes (impact perf).
 */
import {
  Wrench,
  Code2,
  GraduationCap,
  Palette,
  Printer,
  FileText,
  Bot,
  Compass,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Code2,
  GraduationCap,
  Palette,
  Printer,
  FileText,
  Bot,
  Compass,
};

function ServiceIconName({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Code2;
  return <Icon className="h-5 w-5 text-or" aria-hidden />;
}
