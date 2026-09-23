"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import type { Project } from "@/data/portfolio";

const statusStyles: Record<Project["status"], string> = {
  live: "bg-success/15 text-success border-success/30",
  development: "bg-accent-yellow/20 text-accent-dark border-accent-yellow/40",
  concept: "bg-primary-green/15 text-primary-green border-primary-green/30",
};

type PortfolioCardProps = {
  project: Project;
  index?: number;
  className?: string;
};

/**
 * Carte projet portfolio style Win Agro.
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
        "card-base card-shimmer group relative flex flex-col overflow-hidden rounded-2xl",
        className
      )}
    >
      {/* Visuel gradient + emoji */}
      <div
        className="relative flex h-48 items-center justify-center overflow-hidden"
        style={{ background: project.gradient }}
      >
        <div className="absolute inset-0 bg-noir-vert/30 transition-opacity duration-500 group-hover:opacity-10" />
        <span className="text-6xl transition-transform duration-500 group-hover:scale-110" aria-hidden>
          {project.emoji}
        </span>
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full border px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider",
            statusStyles[project.status]
          )}
        >
          {project.statusLabel}
        </span>
      </div>

      {/* Corps */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary-green">
            {project.category}
          </span>
          <h3 className="mt-2 font-serif text-2xl font-bold text-primary-deep transition-colors duration-300 group-hover:text-primary-green">
            {project.title}
          </h3>
        </div>
        <p className="flex-1 text-sm text-gray-text text-pretty">{project.description}</p>

        {/* Tech */}
        <ul className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="border border-primary-pale rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-primary-green"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
