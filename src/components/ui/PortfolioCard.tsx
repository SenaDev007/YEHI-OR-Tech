"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import type { Project } from "@/data/portfolio";
import {
  GraduationCap,
  Sprout,
  Landmark,
  Globe,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Sprout,
  Landmark,
  Globe,
};

const statusStyles: Record<Project["status"], string> = {
  live: "bg-success/15 text-success border-success/30",
  development: "bg-or/15 text-or border-or/30",
  concept: "bg-bleu-electrique/15 text-bleu-electrique border-bleu-electrique/30",
};

type PortfolioCardProps = {
  project: Project;
  index?: number;
  className?: string;
};

/**
 * Carte projet portfolio style Win Agro adapté palette YEHI OR Tech.
 * - Aucun emoji : uniquement icône Lucide
 * - Preview image réelle de la plateforme (next/image)
 * - Border radius partout
 * - Lien direct vers le site en production
 */
export function PortfolioCard({ project, index = 0, className }: PortfolioCardProps) {
  const Icon = iconMap[project.iconName] ?? Globe;

  return (
    <motion.article
      id={project.id}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: (index % 3) * 0.08 }}
      className={cn(
        "card-base card-shimmer group relative flex flex-col overflow-hidden rounded-2xl",
        className
      )}
    >
      {/* Preview image de la plateforme (capture réelle) */}
      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-noir-3">
        {project.previewImage ? (
          <Image
            src={project.previewImage}
            alt={`Capture d'écran de ${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: project.gradient }}
          >
            <Icon className="h-16 w-16 text-white/80" />
          </div>
        )}
        {/* Badge statut (coin supérieur droit) */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border bg-noir-profond/80 backdrop-blur-sm px-2.5 py-1 backdrop-blur-md">
          <span className={cn("h-1.5 w-1.5 rounded-full", project.status === "live" ? "bg-success" : "bg-or")} />
          <span className={cn(
            "font-sans text-[10px] font-bold uppercase tracking-wider",
            statusStyles[project.status].split(" ").find(c => c.startsWith("text-"))
          )}>
            {project.statusLabel}
          </span>
        </div>
      </div>

      {/* Corps */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-or/20 bg-bleu-nuit/50">
            <Icon className="h-5 w-5 text-or" aria-hidden />
          </div>
          <div className="flex-1">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-or">
              {project.category}
            </span>
            <h3 className="mt-1 font-serif text-2xl font-bold text-blanc-creme transition-colors duration-300 group-hover:text-or">
              {project.title}
            </h3>
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visiter ${project.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-or/30 text-or hover:bg-or hover:text-noir-profond transition-all duration-300 hover:scale-110"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <p className="flex-1 text-sm text-gris-light text-pretty">{project.description}</p>

        {/* Tech */}
        <ul className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-gris-dark/30 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-gris"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
