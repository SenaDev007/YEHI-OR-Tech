"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

/**
 * Bouton WhatsApp flottant — masqué quand section #contact dans le viewport.
 * Position fixed bottom-right, animation pulse, tooltip au hover.
 */
export function WhatsAppButton() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contactSection = document.getElementById("contact");
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discuter sur WhatsApp"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className="group fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition-shadow duration-300 animate-pulse-whatsapp hover:shadow-xl"
        >
          <WhatsAppIcon className="h-7 w-7 text-white" />

          {/* Tooltip */}
          <span className="absolute right-full mr-3 whitespace-nowrap bg-noir-profond px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-blanc-creme opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Discuter sur WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
