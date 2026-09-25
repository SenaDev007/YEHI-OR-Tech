"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import { useContent } from "@/lib/use-content";

type PageHeroProps = {
  tag?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  id?: string;
  /** Image professionnelle en arrière-plan du hero (URL) */
  image?: string;
  /** Hauteur personnalisée (par défaut : grand hero) */
  size?: "default" | "compact";
  /**
   * ⭐ Si fourni, les valeurs title/subtitle/tag sont lues depuis
   * l'API /api/leads/page-content?page=<pageKey>. Les props title/subtitle/tag
   * servent de fallback si l'API est vide ou injoignable.
   *
   * Keys attendues dans page_contents (page=pageKey, section=hero) :
   *   - title, subtitle, badge (utilisé comme tag)
   */
  pageKey?: string;
};

/**
 * Hero de page intérieure style Win Agro adapté palette YEHI OR Tech.
 *
 * Si `pageKey` est fourni, les textes sont lus depuis l'API page-content
 * (éditables depuis /manager/page-content). Sinon, utilise les props directes.
 */
export function PageHero({
  tag,
  title,
  subtitle,
  className,
  align = "left",
  id,
  image,
  size = "default",
  pageKey,
}: PageHeroProps) {
  // Si pageKey est fourni, on charge les valeurs éditables
  const { data: pageContent } = useContent<Record<string, string>>(
    pageKey ? `/api/leads/page-content?page=${pageKey}` : "/api/leads/page-content?page=__none__",
    async () => ({}),
  );

  // Valeurs finales : page-content > props > undefined
  const finalTitle = (pageContent && pageContent.hero_title) || title;
  const finalSubtitle = (pageContent && pageContent.hero_subtitle) || subtitle;
  const finalTag = (pageContent && pageContent.hero_badge) || tag;
  const finalImage = (pageContent && pageContent.hero_image) || image;

  const paddingY = size === "compact" ? "pt-[calc(var(--navbar-height)+2rem)] pb-12 md:pb-16" : "pt-[calc(var(--navbar-height)+3rem)] pb-16 md:pt-[calc(var(--navbar-height)+5rem)] md:pb-20";

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden bg-bleu-nuit text-blanc-creme",
        paddingY,
        className
      )}
    >
      {finalImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={finalImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-noir-profond/85 via-bleu-nuit/80 to-noir-profond/90" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(245, 183, 0, 0.08) 0%, transparent 60%)",
            }}
          />
        </div>
      ) : (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-80"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(245, 183, 0, 0.12) 0%, transparent 70%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-grain opacity-30" />
        </>
      )}

      <div className="container-x relative z-10">
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
          {finalTag && (
            <span className="inline-flex items-center gap-3 font-sans font-bold text-[10px] uppercase tracking-wider text-or">
              <span className="h-px w-8 bg-or" />
              {finalTag}
            </span>
          )}
          <h1 className="font-serif text-display-1 font-bold text-blanc-creme text-balance">
            {finalTitle}
          </h1>
          {finalSubtitle && (
            <p
              className={cn(
                "max-w-3xl text-lg text-gris-light text-pretty",
                align === "center" && "mx-auto"
              )}
            >
              {finalSubtitle}
            </p>
          )}
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-8 bg-noir-profond z-10"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </section>
  );
}
