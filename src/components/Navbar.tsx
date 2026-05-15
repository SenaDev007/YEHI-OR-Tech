"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-midnight/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
            YEHI OR <span className="text-gold">Tech</span>
          </span>
          {!isScrolled && (
            <span className="text-[10px] text-gold/80 font-medium hidden md:block uppercase tracking-widest">
              L'excellence numérique
            </span>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gold",
                pathname === link.href ? "text-gold" : "text-white/80"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/devis"
            className="px-5 py-2.5 bg-electric-blue hover:bg-electric-blue/90 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-electric-blue/20 flex items-center group"
          >
            Demander un devis
            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://wa.me/2290141360803"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20 backdrop-blur-sm"
            title="Discuter sur WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-midnight border-b border-white/10 p-6 flex flex-col space-y-4 lg:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-medium py-2 border-b border-white/5",
                  pathname === link.href ? "text-gold" : "text-white/80"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col space-y-4">
              <Link
                href="/devis"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 bg-electric-blue text-white font-bold rounded-xl text-center"
              >
                Demander un devis
              </Link>
              <a
                href="https://wa.me/2290141360803"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white/10 text-white font-bold rounded-xl text-center flex items-center justify-center border border-white/20"
              >
                <WhatsAppIcon className="mr-2 w-5 h-5" /> WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
