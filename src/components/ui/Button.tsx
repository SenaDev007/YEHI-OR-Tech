"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "whatsapp" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-xs",
  md: "px-7 py-3.5 text-sm",
  lg: "px-9 py-4 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "btn-primary",
  outline: "btn-outline",
  whatsapp: "btn-whatsapp",
  ghost:
    "inline-flex items-center justify-center gap-2 text-blanc-creme/80 hover:text-or transition-colors duration-300",
  link:
    "inline-flex items-center gap-2 text-or link-underline font-mono text-xs uppercase tracking-widest",
};

/**
 * Bouton principal YEHI OR Tech — clip-path angulaire, fond or, texte noir.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const isLinkStyle = variant === "ghost" || variant === "link";
  return (
    <Link
      href={href}
      className={cn(
        isLinkStyle ? "" : "inline-flex",
        variantClasses[variant],
        !isLinkStyle && sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Bouton primaire avec flèche par défaut.
 */
export function PrimaryButton({
  children,
  href,
  withArrow = true,
  ...props
}: Omit<ButtonProps, "variant"> & { withArrow?: boolean }) {
  return (
    <Button variant="primary" href={href} {...props}>
      {children}
      {withArrow && <span aria-hidden>→</span>}
    </Button>
  );
}
