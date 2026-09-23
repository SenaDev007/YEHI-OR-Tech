"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { processSteps } from "@/data/process";
import {
  staggerContainer,
  fadeInUp,
  viewportOnce,
} from "@/lib/animations";
import {
  Search,
  ClipboardList,
  PenTool,
  Code2,
  CheckCircle2,
  Rocket,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Search,
  ClipboardList,
  PenTool,
  Code2,
  CheckCircle2,
  Rocket,
};

/**
 * Section Processus — 6 étapes avec ligne de progression animée.
 */
export function ProcessSteps() {
  return (
    <section
      id="processus"
      className="relative py-24 md:py-32 bg-cream"
      aria-labelledby="process-title"
    >
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />

      <div className="container-x relative">
        <SectionHeader
          tag="Notre processus"
          title="Comment nous travaillons"
          description="Six étapes, chacune répond à une peur implicite : flou du besoin, budget caché, découverte du résultat en fin de projet."
        />

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {/* Ligne de progression horizontale (desktop) */}
          <div
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-primary-green/0 via-primary-green/30 to-primary-green/0 lg:block"
            aria-hidden
          />

          {processSteps.map((step, idx) => {
            const Icon = iconMap[step.icon] ?? Code2;
            return (
              <motion.li
                key={step.number}
                variants={fadeInUp}
                transition={{ delay: idx * 0.08 }}
                className="group relative flex flex-col items-start"
              >
                {/* Cercle numéroté */}
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-green/40 bg-white transition-all duration-500 group-hover:bg-primary-green group-hover:border-primary-green">
                  <Icon className="h-6 w-6 text-primary-green transition-colors duration-500 group-hover:text-white" aria-hidden />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center bg-white rounded-full font-sans text-[10px] font-bold text-primary-green border border-primary-green/30">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-primary-deep transition-colors duration-300 group-hover:text-primary-green">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-gray-text text-pretty">
                  {step.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
