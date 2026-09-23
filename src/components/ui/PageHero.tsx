"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";

type PageHeroProps = {
  tag?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  id?: string;
};

/**
 * Hero de page intérieure — tag + titre display + sous-titre.
 * Plus compact que le Hero de la homepage.
 */
export function PageHero({
  tag,
  title,
  subtitle,
  className,
  align = "left",
  id,
}: PageHeroProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden bg-noir-profond pt-[calc(var(--navbar-height)+3rem)] pb-16 md:pt-[calc(var(--navbar-height)+5rem)] md:pb-20",
        className
      )}
    >
      {/* Halo radial supérieur */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(245, 183, 0, 0.10) 0%, transparent 70%)",
        }}
      />
      {/* Grille or subtile */}
      <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-50" />

      <div className="container-x relative">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className={cn(
            "flex flex-col gap-5",
            align === "center" && "items-center text-center"
          )}
        >
          {tag && <span className="section-tag">{tag}</span>}
          <h1 className="font-display text-display-1 font-medium text-blanc-creme text-balance">
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "max-w-3xl text-lg text-gris-light text-pretty",
                align === "center" && "mx-auto"
              )}
            >
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
