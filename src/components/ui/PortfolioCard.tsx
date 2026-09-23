"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import type { Project } from "@/data/portfolio";

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
 * Carte projet portfolio avec badge statut toujours visible.
 */
export function PortfolioCard({ project, index = 0, className }: PortfolioCardProps) {
  return (
    <motion.article
      id={project.id}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: (index % 3) * 0.08 }}
      className={cn(
        "card-base corner-decor group relative flex flex-col overflow-hidden",
        className
      )}
    >
      {/* Visuel gradient + emoji */}
      <div
        className="relative flex h-48 items-center justify-center overflow-hidden"
        style={{ background: project.gradient }}
      >
        <div className="absolute inset-0 bg-noir-profond/30 transition-opacity duration-500 group-hover:opacity-10" />
        <span className="text-6xl transition-transform duration-500 group-hover:scale-110" aria-hidden>
          {project.emoji}
        </span>
        <span
          className={cn(
            "badge-clip absolute right-3 top-3 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
            statusStyles[project.status]
          )}
        >
          {project.statusLabel}
        </span>
      </div>

      {/* Corps */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-or">
            {project.category}
          </span>
          <h3 className="mt-2 font-display text-2xl font-medium text-blanc-creme transition-colors duration-300 group-hover:text-or">
            {project.title}
          </h3>
        </div>
        <p className="flex-1 text-sm text-gris-light text-pretty">{project.description}</p>

        {/* Tech */}
        <ul className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="border border-gris-dark/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gris"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
