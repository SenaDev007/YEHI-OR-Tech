"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-noir-profond pt-20 pb-16 overflow-hidden relative border-t border-white/5">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] glow-blue opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Massive Brand Footer */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-12">
            <Link href="/" className="text-[12vw] font-display font-bold tracking-tighter text-white leading-none group">
              YEHI <span className="text-or group-hover:text-or-light transition-colors">OR</span>
            </Link>
            <div className="text-right max-w-sm ml-auto">
              <p className="text-lg text-gris leading-snug mb-8">
                L'agence de production digitale qui fusionne intelligence artificielle 
                et design de classe mondiale.
              </p>
              <Button variant="outline">
                Parlons-en
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32 border-t border-white/5 pt-20">
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-10 uppercase text-[10px] tracking-[0.3em] font-mono text-gris-dark">Sitemap</h4>
            <ul className="space-y-4">
              {["Accueil", "Services", "Portfolio", "À propos", "Contact"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace("à ", "").replace("accueil", "")}`} className="text-lg text-gris hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertises */}
          <div>
            <h4 className="text-white font-bold mb-10 uppercase text-[10px] tracking-[0.3em] font-mono text-gris-dark">Expertises</h4>
            <ul className="space-y-4">
              {["Web Design", "App Development", "AI Integration", "Automation", "SEO Strategy"].map((service) => (
                <li key={service}>
                  <span className="text-lg text-gris">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <h4 className="text-white font-bold mb-10 uppercase text-[10px] tracking-[0.3em] font-mono text-gris-dark">Connect</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-xs font-mono text-gris-dark uppercase tracking-widest">Email</p>
                  <a href="mailto:contact@yehiortech.com" className="text-xl text-white hover:text-or transition-colors">contact@yehiortech.com</a>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-mono text-gris-dark uppercase tracking-widest">Office</p>
                  <p className="text-xl text-white">Parakou, Bénin</p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex gap-12">
              {["LinkedIn", "Instagram", "WhatsApp", "X"].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-xs font-mono text-gris-dark hover:text-or uppercase tracking-[0.2em] transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-mono text-gris-dark uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Studio YEHI OR. All rights reserved.
          </p>
          <div className="flex gap-12">
            <Link href="/privacy" className="text-[10px] font-mono text-gris-dark hover:text-white uppercase tracking-[0.2em] transition-colors">Privacy</Link>
            <Link href="/legal" className="text-[10px] font-mono text-gris-dark hover:text-white uppercase tracking-[0.2em] transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
