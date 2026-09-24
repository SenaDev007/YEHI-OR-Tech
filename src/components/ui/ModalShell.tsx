"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

type ModalShellProps = {
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
};

/**
 * ModalShell — conteneur de modal réutilisable qui fixe le problème
 * du début sectionné sur mobile et PC.
 *
 * Fixes :
 * - items-start (pas items-center) pour que le modal commence en haut
 * - max-h-[90vh] + overflow-y-auto sur le contenu interne
 * - pt-[5vh] pour un peu d'espace en haut
 * - Le contenu scroll à l'intérieur du modal, pas la page entière
 */
export function ModalShell({ onClose, children, maxWidth = "max-w-2xl" }: ModalShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-noir-profond/80 backdrop-blur-sm flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} max-h-[85vh] overflow-y-auto rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
