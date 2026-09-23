"use client";

import Link from "next/link";
import { Linkedin, Facebook, Mail, MapPin, Phone, Clock } from "lucide-react";
import {
  footerServiceLinks,
  footerProductLinks,
  footerCompanyLinks,
} from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { BrandLogo } from "@/components/ui/BrandLogo";

/**
 * Footer multi-colonnes : Brand · Services · Produits SaaS · Entreprise.
 * Fond noir profond, jamais de fond clair.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-auto border-t border-or/10 bg-noir-profond"
      role="contentinfo"
    >
      {/* Halo supérieur subtil */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(245, 183, 0, 0.4) 50%, transparent 100%)",
        }}
      />

      <div className="container-x py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Colonne Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center" aria-label="Accueil">
              <BrandLogo variant="compact" height={40} />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gris text-pretty">
              {siteConfig.slogan}
            </p>

            {/* Réseaux sociaux */}
            <ul className="mt-6 flex items-center gap-3">
              <li>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center border border-gris-dark/30 text-gris transition-all duration-300 hover:border-or hover:text-or"
                >
                  <Linkedin className="h-4 w-4" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center border border-gris-dark/30 text-gris transition-all duration-300 hover:border-or hover:text-or"
                >
                  <Facebook className="h-4 w-4" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center border border-gris-dark/30 text-gris transition-all duration-300 hover:border-or hover:text-or"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                </a>
              </li>
            </ul>

            {/* Coordonnées rapides */}
            <ul className="mt-6 space-y-2 text-xs text-gris-light">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-or" aria-hidden />
                <span>{siteConfig.city}, {siteConfig.country}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-or" aria-hidden />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="link-underline"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-or" aria-hidden />
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="link-underline">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-or" aria-hidden />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>
          </div>

          {/* Colonne Services */}
          <nav aria-label="Services">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-or">
              Services
            </h3>
            <ul className="mt-5 space-y-2.5">
              {footerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gris-light transition-colors duration-300 hover:text-or link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonne Produits SaaS */}
          <nav aria-label="Produits SaaS">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-or">
              Produits SaaS
            </h3>
            <ul className="mt-5 space-y-2.5">
              {footerProductLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gris-light transition-colors duration-300 hover:text-or link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonne Entreprise */}
          <nav aria-label="Entreprise">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-or">
              Entreprise
            </h3>
            <ul className="mt-5 space-y-2.5">
              {footerCompanyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gris-light transition-colors duration-300 hover:text-or link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bas du footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-gris-dark/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-gris">
            © {year} YEHI OR Tech. Tous droits réservés.
          </p>
          <p className="font-mono text-xs text-or">
            Que la lumière soit <span aria-hidden>✦</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
