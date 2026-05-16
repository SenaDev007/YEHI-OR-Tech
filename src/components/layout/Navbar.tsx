"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Tarifs", href: "/tarifs" },
  { name: "Réalisations", href: "/portfolio" },
  { name: "À propos", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        "fixed top-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-7xl z-50 transition-all duration-700",
        isScrolled 
          ? "glass py-3 px-10 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-white/5" 
          : "bg-transparent py-6 px-4"
      )}
    >
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-display font-bold tracking-tighter text-white group">
          YEHI <span className="text-or group-hover:text-white transition-colors duration-500">OR</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] font-mono uppercase tracking-[0.4em] transition-all duration-500 relative group",
                pathname === link.href ? "text-or" : "text-gris-dark hover:text-white"
              )}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 w-full h-px bg-or" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button size="sm" className="px-8 h-10 text-[10px] uppercase tracking-[0.4em] font-mono">
            Projet
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2 glass pill w-10 h-10 flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 top-[88px] bg-noir-profond/95 backdrop-blur-2xl z-40 lg:hidden flex flex-col p-12"
          >
            <div className="flex flex-col gap-12 items-start justify-center flex-grow">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-5xl font-display font-medium tracking-tighter uppercase",
                      pathname === link.href ? "text-or" : "text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-12 w-full"
              >
                <Button size="lg" className="w-full">Démarrer un projet</Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
