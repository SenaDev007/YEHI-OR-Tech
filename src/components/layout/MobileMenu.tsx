"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Menu mobile plein écran — overlay noir, liens centrés, animation stagger.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock scroll quand ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fermer sur changement de route
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Fermer sur Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden text-blanc-creme hover:text-or transition-colors p-2"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-noir-profond/95 backdrop-blur-xl lg:hidden"
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 text-blanc-creme hover:text-or transition-colors p-2"
              aria-label="Fermer le menu"
            >
              <X className="h-7 w-7" />
            </button>

            {/* Liens centrés */}
            <nav
              className="flex h-full flex-col items-center justify-center gap-2"
              aria-label="Navigation mobile"
            >
              <motion.ul
                className="flex flex-col items-center gap-3"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                }}
              >
                <li>
                  <MobileLink href="/" label="Accueil" active={pathname === "/"} />
                </li>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <MobileLink
                      href={link.href}
                      label={link.label}
                      active={pathname === link.href || pathname.startsWith(link.href + "/")}
                    />
                  </li>
                ))}
                <li className="mt-8">
                  <Link href="/contact" className="btn-primary">
                    Demander un devis →
                  </Link>
                </li>
              </motion.ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Link
        href={href}
        className={cn(
          "font-display text-3xl font-medium transition-colors duration-300",
          active ? "text-or" : "text-blanc-creme hover:text-or"
        )}
      >
        {label}
      </Link>
    </motion.div>
  );
}
