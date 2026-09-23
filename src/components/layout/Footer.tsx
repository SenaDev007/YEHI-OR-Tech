"use client";

import Link from "next/link";
import Image from "next/image";
import { footerServiceLinks, footerProductLinks, footerCompanyLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";

/**
 * Footer style Win Agro adapté palette YEHI OR Tech :
 * bg noir-profond, bordure top or, 4 colonnes, logo avec light beam,
 * réseaux sociaux en cercles.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-noir-profond text-gris-light border-t-4 border-or relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />
      <div className="container-x py-16 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 focus:outline-none">
              <div className="relative w-16 h-16 overflow-hidden rounded-full border border-or/30 bg-noir-profond flex items-center justify-center p-0.5 shadow-md">
                <Image src="/icon-192.png" alt="YEHI OR Tech" width={60} height={60} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold leading-tight text-blanc-creme tracking-wide">YEHI OR</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-or">Agence digitale</span>
              </div>
            </Link>
            <p className="text-sm text-gris font-sans leading-relaxed">{siteConfig.slogan}</p>
            <ul className="flex items-center gap-4">
              <li>
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-or/20 hover:bg-or text-noir-profond hover:text-noir-profond flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.07-.93-2.07-2.07s.93-2.07 2.07-2.07 2.07.93 2.07 2.07-.93 2.07-2.07 2.07zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.78C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.78 24h20.44c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-bleu-electrique/20 hover:bg-bleu-electrique text-blanc-creme hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-whatsapp/20 hover:bg-whatsapp text-blanc-creme hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="text-blanc-creme font-serif text-base font-bold tracking-wider mb-6 border-b border-or/20 pb-2">Services</h3>
            <ul className="space-y-4 font-sans text-sm">
              {footerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-or transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Produits SaaS */}
          <nav aria-label="Produits SaaS">
            <h3 className="text-blanc-creme font-serif text-base font-bold tracking-wider mb-6 border-b border-or/20 pb-2">Produits SaaS</h3>
            <ul className="space-y-4 font-sans text-sm">
              {footerProductLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-or transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact direct */}
          <nav aria-label="Entreprise">
            <h3 className="text-blanc-creme font-serif text-base font-bold tracking-wider mb-6 border-b border-or/20 pb-2">Contact direct</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li className="flex items-center gap-3">
                <span className="text-or">📱</span>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-or transition-colors font-bold">{siteConfig.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-or">✉️</span>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-or transition-colors">{siteConfig.email}</a>
              </li>
              <li className="flex items-center gap-3 text-xs text-gris">
                <span className="text-bleu-electrique">📍</span>
                <span>{siteConfig.city}, {siteConfig.country}</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-gris">
                <span className="text-bleu-electrique">⏰</span>
                <span>{siteConfig.hours}</span>
              </li>
              <li className="pt-4 border-t border-or/10 space-y-3">
                <p className="text-xs text-gris font-sans uppercase font-bold tracking-wider mb-3">Entreprise</p>
                <ul className="space-y-2">
                  {footerCompanyLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm hover:text-or transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-or/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gris">
          <p className="font-sans">© {year} {siteConfig.name}. Tous droits réservés.</p>
          <p className="font-sans font-bold text-or">Que la lumière soit ✦</p>
        </div>
      </div>
    </footer>
  );
}
