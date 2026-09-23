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
 * Navbar style Win Agro : light theme, fond blanc au scroll, logo avec light beam,
 * bouton CTA rounded-full avec btn-shimmer + animation pulse lente.
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
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-primary-green py-2"
          : "bg-white py-4 border-b border-transparent"
      )}
      role="banner"
    >
      <div className="container-x flex h-16 items-center justify-between">
        {/* Logo avec light beam — style Win Agro */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-105 focus:outline-none"
          aria-label="YEHI OR Tech — Accueil"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary-green/30 bg-noir-vert logo-light-beam shadow-md flex items-center justify-center p-0.5">
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
            <span className="font-serif text-lg font-bold leading-tight text-primary-deep tracking-wide">
              YEHI OR
            </span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary-green">
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
              pathname === "/" ? "text-primary-green" : "text-gray-text hover:text-primary-green"
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
                  active ? "text-primary-green" : "text-gray-text hover:text-primary-green"
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
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(9, 137, 71, 0.4)" }}
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
