import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "full" | "compact" | "symbol";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  /** Hauteur du logo en pixels (la largeur s'ajuste automatiquement) */
  height?: number;
  /** Couleur de fond pour s'assurer du contraste (sur fond sombre le logo officiel reste lisible) */
  withBackground?: boolean;
  priority?: boolean;
};

/**
 * Logo officiel YEHI OR Tech.
 *
 * Variantes :
 * - `full`    → logo complet (symbole + wordmark) pour footer, OG, landing
 * - `compact` → symbole seul + wordmark texte stylisé pour navbar
 * - `symbol`  → symbole seul pour favicon-likes, mobile menu, etc.
 *
 * Source : images YEHI OR Tech/yehior-favicon-for-app/
 */
export function BrandLogo({
  variant = "full",
  className,
  height = 40,
  withBackground = false,
  priority = false,
}: BrandLogoProps) {
  // Ratio approximatif du logo officiel (carré avec espace pour wordmark)
  const symbolHeight = height;
  const symbolWidth = height; // carré

  if (variant === "symbol") {
    return (
      <Image
        src="/icon-192.png"
        alt="YEHI OR Tech"
        width={symbolWidth}
        height={symbolHeight}
        priority={priority}
        className={cn("object-contain", className)}
      />
    );
  }

  if (variant === "compact") {
    // Navbar : symbole + wordmark texte stylisé
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2.5",
          className
        )}
      >
        <Image
          src="/icon-192.png"
          alt="YEHI OR Tech — symbole"
          width={symbolWidth}
          height={symbolHeight}
          priority={priority}
          className="object-contain"
        />
        <span className="font-display text-xl font-semibold tracking-tight leading-none">
          <span className="text-blanc-creme">YEHI OR </span>
          <span className="text-or">TECH</span>
        </span>
      </span>
    );
  }

  // full : logo complet (apple-icon 180x180 est le plus propre pour le wordmark complet)
  return (
    <Image
      src="/apple-icon.png"
      alt="YEHI OR Tech"
      width={height * 2.5}
      height={height}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
