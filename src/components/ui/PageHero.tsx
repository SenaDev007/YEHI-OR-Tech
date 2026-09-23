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
 * Hero de page intérieure style Win Agro : fond vert foncé, halo jaune, titre serif.
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
        "relative overflow-hidden bg-noir-vert text-white pt-[calc(var(--navbar-height)+3rem)] pb-16 md:pt-[calc(var(--navbar-height)+5rem)] md:pb-20",
        className
      )}
    >
      {/* Halo jaune radial supérieur */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(253, 221, 0, 0.12) 0%, transparent 70%)",
        }}
      />
      {/* Grain */}
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
            <span className="inline-flex items-center gap-3 font-sans font-bold text-[10px] uppercase tracking-wider text-accent-yellow">
              <span className="h-px w-8 bg-accent-yellow" />
              {tag}
            </span>
          )}
          <h1 className="font-serif text-display-1 font-bold text-white text-balance">
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "max-w-3xl text-lg text-gray-200 text-pretty",
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
        className="absolute bottom-0 left-0 right-0 h-8 bg-cream"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </section>
  );
}
