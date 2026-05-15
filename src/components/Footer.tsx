import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe, Briefcase, X, Camera, ArrowUpRight } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { navLinks } from "@/data/navigation";

const Footer = () => {
  const socials = [
    { Icon: Globe, href: "#" },
    { Icon: Briefcase, href: "#" },
    { Icon: X, href: "#" },
    { Icon: Camera, href: "#" },
    { Icon: WhatsAppIcon, href: "https://wa.me/2290141360803" },
  ];

  return (
    <footer className="bg-premium-black pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-bold text-white tracking-tight">
              YEHI OR <span className="text-gold">Tech</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Des idées lumineuses, des solutions encore plus brillantes. Nous accompagnons 
              les entreprises dans leur transformation numérique avec excellence et innovation.
            </p>
            <div className="flex space-x-4">
              {socials.map((social, idx) => (
                <a key={idx} href={social.href} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-gold hover:text-midnight hover:border-gold transition-all">
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Navigation</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/40 hover:text-gold text-sm transition-colors flex items-center group">
                    <ArrowUpRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6">Expertises</h4>
            <ul className="space-y-4">
              {["Sites Vitrines", "E-commerce", "Apps Mobiles", "Agents IA", "Automatisation", "SEO & Marketing"].map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-white/40 hover:text-gold text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Email</div>
                  <a href="mailto:contact@yehiortech.com" className="text-white/80 hover:text-gold text-sm transition-colors">
                    contact@yehiortech.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Téléphone</div>
                  <a href="tel:+2290141360803" className="text-white/80 hover:text-gold text-sm transition-colors">
                    +229 01 41 36 08 03
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Adresse</div>
                  <span className="text-white/80 text-sm">
                    Bénin, West Africa
                  </span>
                </div>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} YEHI OR Tech. Tous droits réservés.
          </p>
          <div className="flex space-x-8">
            <Link href="/legal" className="text-white/20 hover:text-white/40 text-xs transition-colors">Mentions légales</Link>
            <Link href="/privacy" className="text-white/20 hover:text-white/40 text-xs transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
