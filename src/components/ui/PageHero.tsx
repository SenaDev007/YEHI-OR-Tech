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
 * Hero de page intérieure style Win Agro adapté palette YEHI OR Tech :
 * fond bleu-nuit, halo or, titre serif Playfair, divider diagonal noir-profond.
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
        "relative overflow-hidden bg-bleu-nuit text-blanc-creme pt-[calc(var(--navbar-height)+3rem)] pb-16 md:pt-[calc(var(--navbar-height)+5rem)] md:pb-20",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(245, 183, 0, 0.12) 0%, transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-30" />

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
          {tag && (
            <span className="inline-flex items-center gap-3 font-sans font-bold text-[10px] uppercase tracking-wider text-or">
              <span className="h-px w-8 bg-or" />
              {tag}
            </span>
          )}
          <h1 className="font-serif text-display-1 font-bold text-blanc-creme text-balance">
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

      {/* Divider diagonal — style Win Agro */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 bg-noir-profond"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </section>
  );
}
