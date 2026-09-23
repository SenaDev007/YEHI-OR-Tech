"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";

/**
 * Navbar sticky transparente au top, backdrop-blur + fond noir au scroll.
 * Logo compact : symbole + wordmark texte (YEHI OR en blanc, TECH en or).
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-400 ease-premium",
        scrolled
          ? "border-b border-or/15 bg-noir-profond/95 backdrop-blur-xl"
          : "bg-transparent"
      )}
      style={{ height: "var(--navbar-height)" }}
      role="banner"
    >
      <div className="container-x flex h-full items-center justify-between">
        {/* Logo compact */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="YEHI OR Tech — Accueil"
        >
          <BrandSymbol />
          <span className="font-display text-xl font-semibold tracking-tight">
            <span className="text-blanc-creme">YEHI OR </span>
            <span className="text-or transition-colors duration-300 group-hover:text-or-light">
              TECH
            </span>
          </span>
        </Link>

        {/* Liens desktop */}
        <nav
          className="hidden lg:flex items-center gap-8"
          role="navigation"
          aria-label="Navigation principale"
        >
          <Link
            href="/"
            className={cn(
              "link-underline font-sans text-sm font-medium transition-colors duration-300",
              pathname === "/" ? "text-or" : "text-blanc-creme/80 hover:text-or"
            )}
          >
            Accueil
          </Link>
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link-underline font-sans text-sm font-medium transition-colors duration-300",
                  active ? "text-or" : "text-blanc-creme/80 hover:text-or"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + mobile menu trigger */}
        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn-primary hidden md:inline-flex">
            Demander un devis →
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

/**
 * Symbole compact pour navbar : croissant + étoile stylisés en SVG.
 * Version monoligne blanc/or — calcul de contraste WCAG OK sur fond noir.
 */
function BrandSymbol() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="transition-transform duration-500 group-hover:rotate-12"
    >
      {/* Croissant stylisé */}
      <path
        d="M22 16a8 8 0 1 1-8-8 6 6 0 0 0 8 8z"
        fill="url(#brand-gradient)"
        stroke="#F5B700"
        strokeWidth="0.5"
      />
      {/* Étoile */}
      <path
        d="M24 6l1.2 3.3 3.3 1.2-3.3 1.2L24 15l-1.2-3.3-3.3-1.2 3.3-1.2L24 6z"
        fill="#F5B700"
      />
      <defs>
        <linearGradient
          id="brand-gradient"
          x1="6"
          y1="6"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#071A2F" />
          <stop offset="0.5" stopColor="#0B3D91" />
          <stop offset="1" stopColor="#1464F4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
