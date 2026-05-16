"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-noir-profond border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-or/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-display font-bold tracking-tight text-white mb-8 block">
              YEHI <span className="text-or">OR</span> Tech
            </Link>
            <p className="text-gris text-sm leading-relaxed mb-8 max-w-xs">
              Une agence digitale augmentée par l'IA, dédiée à éclairer et transformer 
              la présence numérique des entreprises africaines.
            </p>
            <div className="flex gap-4">
              {["Facebook", "LinkedIn", "Instagram", "WhatsApp"].map((social) => (
                <div key={social} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-or hover:border-or/40 transition-all cursor-pointer">
                  <span className="sr-only">{social}</span>
                  {social === "WhatsApp" ? <MessageCircle className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em] font-mono">Navigation</h4>
            <ul className="space-y-4">
              {["Accueil", "Services", "Tarifs", "Portfolio", "À propos", "Contact"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace("à ", "").replace("accueil", "")}`} className="text-gris hover:text-or transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em] font-mono">Services</h4>
            <ul className="space-y-4">
              {["Sites Web", "Applications SaaS", "Agents IA", "Automatisation", "Marketing Digital", "Emails Pro"].map((service) => (
                <li key={service}>
                  <span className="text-gris text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em] font-mono">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-or mt-1 flex-shrink-0" />
                <span className="text-gris text-sm leading-relaxed">
                  Parakou, Bénin<br />Afrique de l'Ouest
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-or flex-shrink-0" />
                <span className="text-gris text-sm">contact@yehiortech.com</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-or flex-shrink-0" />
                <span className="text-gris text-sm">+229 XX XX XX XX</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-xs font-mono">
            © {new Date().getFullYear()} YEHI OR Tech. Tous droits réservés.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-white/20 hover:text-or transition-colors text-xs font-mono">Confidentialité</Link>
            <Link href="/legal" className="text-white/20 hover:text-or transition-colors text-xs font-mono">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
