"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";
import { BrandLogo } from "@/components/ui/BrandLogo";

/**
 * Navbar sticky transparente au top, backdrop-blur + fond noir au scroll.
 * Logo compact : symbole officiel + wordmark texte (YEHI OR en blanc, TECH en or).
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium",
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
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
          aria-label="YEHI OR Tech — Accueil"
        >
          <BrandLogo variant="compact" height={42} priority />
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
