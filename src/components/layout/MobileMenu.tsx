"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Menu mobile — séparé en 2 composants :
 *
 * 1. MobileMenuButton : le bouton hamburger (rendu DANS le header z-50)
 * 2. MobileMenuOverlay : l'overlay plein écran (rendu HORS du header z-[200])
 *
 * Cette séparation évite le problème de stacking context : l'overlay
 * est au niveau racine du DOM, pas piégé dans le z-50 du header.
 * Les liens sont cliquables sur mobile.
 */

type MobileMenuButtonProps = {
  open: boolean;
  onOpen: () => void;
};

export function MobileMenuButton({ open, onOpen }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onOpen}
      className="lg:hidden text-blanc-creme hover:text-or transition-colors p-2 relative z-50"
      aria-label="Ouvrir le menu"
      aria-expanded={open}
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}

type MobileMenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenuOverlay({ open, onClose }: MobileMenuOverlayProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-noir-profond/98 backdrop-blur-xl lg:hidden"
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-blanc-creme hover:text-or transition-colors p-2 z-10"
            aria-label="Fermer le menu"
          >
            <X className="h-7 w-7" />
          </button>

          <nav
            className="flex h-full flex-col items-center justify-center gap-2 pointer-events-auto"
            aria-label="Navigation mobile"
          >
            <motion.ul
              className="flex flex-col items-center gap-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
              <li>
                <MobileLink href="/" label="Accueil" active={pathname === "/"} onClick={onClose} />
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <MobileLink
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href || pathname.startsWith(link.href + "/")}
                    onClick={onClose}
                  />
                </li>
              ))}
              <li className="mt-8">
                <Link href="/contact" onClick={onClose} className="btn-primary btn-shimmer">
                  Demander un devis →
                </Link>
              </li>
            </motion.ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Composant original MobileMenu (bouton + overlay combinés) — compat */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <MobileMenuButton open={open} onOpen={() => setOpen(true)} />
      <MobileMenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MobileLink({
  href, label, active, onClick,
}: { href: string; label: string; active: boolean; onClick?: () => void }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "font-serif text-3xl font-bold transition-colors duration-300",
          active ? "text-or" : "text-blanc-creme hover:text-or"
        )}
      >
        {label}
      </Link>
    </motion.div>
  );
}
