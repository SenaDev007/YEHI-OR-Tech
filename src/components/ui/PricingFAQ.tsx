"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { pricingFaq } from "@/data/pricing";
import { cn } from "@/lib/utils";

/**
 * FAQ accordéon pour la page /tarifs.
 */
export function PricingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <dl className="flex flex-col gap-3">
      {pricingFaq.map((item, idx) => {
        const open = openIdx === idx;
        return (
          <div
            key={item.question}
            className={cn(
              "border bg-noir-2 transition-colors duration-300",
              open ? "border-or/40" : "border-gris-dark/30"
            )}
          >
            <dt>
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : idx)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-display text-lg font-medium text-blanc-creme text-pretty">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-or transition-transform duration-300",
                    open && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
            </dt>
            <AnimatePresence initial={false}>
              {open && (
                <motion.dd
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-gris-light text-pretty">
                    {item.answer}
                  </p>
                </motion.dd>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </dl>
  );
}
