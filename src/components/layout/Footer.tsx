"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Linkedin, Facebook } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { footerServiceLinks, footerProductLinks, footerCompanyLinks } from "@/data/navigation";
import { useSettings } from "@/components/SettingsProvider";

/**
 * Footer style Win Agro adapté palette YEHI OR Tech :
 * - Logo sur fond blanc (logo-light-beam)
 * - "YEHI OR Tech" (pas "YEHI OR")
 * - Aucun emoji : uniquement icônes Lucide + vraie icône WhatsApp officielle
 * - Paramètres (email, phone, WhatsApp, réseaux) lus depuis la DB via useSettings()
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-noir-profond text-gris-light border-t-4 border-or relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />
      <div className="container-x py-16 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 focus:outline-none">
              <div className="relative w-16 h-16 overflow-hidden rounded-full border border-or/30 bg-white flex items-center justify-center p-0.5 shadow-md">
                <Image src="/icon-192.png" alt="YEHI OR Tech" width={60} height={60} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold leading-tight text-blanc-creme tracking-wide">YEHI OR Tech</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-or">Agence digitale</span>
              </div>
            </Link>
            <p className="text-sm text-gris font-sans leading-relaxed">
              Des idées lumineuses, des solutions encore plus brillantes.
            </p>
            <ul className="flex items-center gap-4">
              <li>
                <a href={settings.socialLinkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-or/20 hover:bg-or text-noir-profond hover:text-noir-profond flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Linkedin className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-bleu-electrique/20 hover:bg-bleu-electrique text-blanc-creme hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Facebook className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href={settings.socialWhatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-whatsapp/20 hover:bg-whatsapp text-blanc-creme hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <WhatsAppIcon className="h-5 w-5" />
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

          {/* Contact direct — depuis la DB, icônes Lucide */}
          <nav aria-label="Entreprise">
            <h3 className="text-blanc-creme font-serif text-base font-bold tracking-wider mb-6 border-b border-or/20 pb-2">Contact direct</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-or shrink-0" />
                <a href={`tel:${settings.phoneNumber.replace(/\s/g, "")}`} className="hover:text-or transition-colors font-bold">{settings.phoneNumber}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-or shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-or transition-colors">{settings.contactEmail}</a>
              </li>
              <li className="flex items-center gap-3 text-xs text-gris">
                <MapPin className="h-3.5 w-3.5 text-bleu-electrique shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-gris">
                <Clock className="h-3.5 w-3.5 text-bleu-electrique shrink-0" />
                <span>{settings.hours}</span>
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
          <p className="font-sans">© {year} YEHI OR Tech. Tous droits réservés.</p>
          <p className="font-sans font-bold text-or">Que la lumière soit ✦</p>
        </div>
      </div>
    </footer>
  );
}
