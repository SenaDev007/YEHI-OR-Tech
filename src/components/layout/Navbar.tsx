"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";

/**
 * Navbar style Win Agro adaptée palette YEHI OR Tech :
 * dark theme, fond noir-profond au scroll avec backdrop-blur,
 * logo avec light beam (gold + blue), CTA or rounded-full avec btn-shimmer + pulse-slow.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-noir-profond/95 backdrop-blur-md shadow-md border-b border-or/15 py-2"
          : "bg-transparent py-4 border-b border-transparent"
      )}
      role="banner"
    >
      <div className="container-x flex h-16 items-center justify-between">
        {/* Logo avec light beam — version gold + blue */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-105 focus:outline-none"
          aria-label="YEHI OR Tech — Accueil"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-or/30 bg-noir-profond logo-light-beam shadow-md flex items-center justify-center p-0.5">
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
              YEHI OR
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

        {/* CTA + mobile menu trigger */}
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
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
