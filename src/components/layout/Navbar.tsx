"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";
import { MobileMenuButton, MobileMenuOverlay } from "./MobileMenu";

/**
 * Navbar — sticky transparente au top, backdrop-blur au scroll.
 *
 * ⚠️ Architecture mobile :
 * - Le bouton hamburger (MobileMenuButton) est DANS le header (z-50)
 * - L'overlay plein écran (MobileMenuOverlay) est HORS du header (z-[200])
 *   pour éviter les problèmes de stacking context qui rendaient les liens
 *   non cliquables sur mobile.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-or/15 bg-noir-profond/95 backdrop-blur-xl py-2"
            : "bg-transparent py-4 border-b border-transparent"
        )}
        role="banner"
      >
        <div className="container-x flex h-16 items-center justify-between">
          {/* Logo avec light beam — fond blanc */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-105 focus:outline-none"
            aria-label="YEHI OR Tech — Accueil"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-or/30 bg-white logo-light-beam shadow-md flex items-center justify-center p-0.5">
              <Image
                src="/icon-192.png"
                alt="YEHI OR Tech"
                width={44}
                height={44}
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold leading-tight text-blanc-creme tracking-wide">
                YEHI OR Tech
              </span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-or">
                Agence digitale
              </span>
            </div>
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
                "link-underline font-sans text-sm font-bold transition-colors duration-300",
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
                    "link-underline font-sans text-sm font-bold transition-colors duration-300",
                    active ? "text-or" : "text-blanc-creme/80 hover:text-or"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA desktop + bouton hamburger (dans le header) */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(245, 183, 0, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
              className="hidden md:block"
            >
              <Link href="/contact" className="btn-primary btn-shimmer">
                Demander un devis →
              </Link>
            </motion.div>
            <MobileMenuButton open={mobileOpen} onOpen={() => setMobileOpen(true)} />
          </div>
        </div>
      </header>

      {/* Overlay mobile rendu HORS du header — z-[200] au niveau racine */}
      <MobileMenuOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
