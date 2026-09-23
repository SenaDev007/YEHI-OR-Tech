"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/data/services";
import { whatsappLink, cn } from "@/lib/utils";
import {
  Wrench,
  Code2,
  GraduationCap,
  Palette,
  Printer,
  FileText,
  Bot,
  Compass,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Code2,
  GraduationCap,
  Palette,
  Printer,
  FileText,
  Bot,
  Compass,
};

const availabilityStyles = {
  immediate: "bg-success/15 text-success border-success/30",
  "sur-devis": "bg-or/15 text-or border-or/30",
  produit: "bg-bleu-electrique/15 text-bleu-electrique border-bleu-electrique/30",
} as const;

// Animations qui se re-déclenchent à chaque entrée dans le viewport
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * Liste détaillée des 8 services avec navigation latérale sticky (scroll spy).
 * Animation de transition entre sections : à chaque entrée dans le viewport,
 * la section ré-apparaît en fade + slide (once: false).
 */
export function ServicesDetailList() {
  const [activeSlug, setActiveSlug] = useState(services[0].slug);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    services.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 md:py-24 bg-noir-profond" aria-labelledby="services-detail-title">
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />
      <div className="container-x relative">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
          {/* Navigation latérale sticky (desktop) */}
          <aside className="hidden lg:block">
            <nav
              className="sticky top-[calc(var(--navbar-height)+2rem)]"
              aria-label="Navigation des services"
            >
              <span className="section-tag mb-4">Sommaire</span>
              <ol className="mt-4 flex flex-col gap-1 border-l border-gris-dark/30">
                {services.map((service) => {
                  const active = activeSlug === service.slug;
                  return (
                    <li key={service.slug}>
                      <a
                        href={`#${service.slug}`}
                        className={cn(
                          "block rounded-full border-l-2 -ml-px px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300",
                          active
                            ? "border-or bg-or/5 text-or"
                            : "border-transparent text-gris hover:border-or/30 hover:text-blanc-creme"
                        )}
                      >
                        <span className="mr-2">{service.number}</span>
                        {service.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          {/* Liste des services avec animations */}
          <div className="flex flex-col gap-20">
            {services.map((service, idx) => {
              const Icon = iconMap[service.icon] ?? Code2;
              return (
                <motion.article
                  key={service.slug}
                  id={service.slug}
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, margin: "-20% 0px -50% 0px" }}
                  className="scroll-mt-32"
                >
                  {/* En-tête */}
                  <header className="mb-6 flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-or/30 bg-bleu-nuit/50">
                      <Icon className="h-7 w-7 text-or" aria-hidden />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-sans text-xs text-gris">{service.number}</span>
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider",
                            availabilityStyles[service.availability]
                          )}
                        >
                          {service.availabilityLabel}
                        </span>
                      </div>
                      <h2 className="mt-2 font-serif text-3xl font-bold text-blanc-creme md:text-4xl">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-base text-or text-pretty">{service.tagline}</p>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Colonne gauche : problème + description */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      {/* Problème traité */}
                      <div className="rounded-2xl border-l-2 border-or/40 bg-bleu-nuit/20 p-5">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-or">
                          Problème traité
                        </span>
                        <p className="mt-2 text-sm text-gris-light text-pretty">
                          {service.problem}
                        </p>
                      </div>

                      {/* Description complète */}
                      <div>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
                          Description
                        </span>
                        <p className="mt-2 text-base text-blanc-creme text-pretty">
                          {service.fullDescription}
                        </p>
                      </div>

                      {/* Prestations */}
                      <div>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
                          Prestations
                        </span>
                        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {service.deliverables.map((d) => (
                            <li
                              key={d}
                              className="flex items-start gap-2 rounded-lg bg-noir-2 p-2 text-sm text-gris-light"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-or" aria-hidden />
                              <span className="text-pretty">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Limite commerciale */}
                      {service.commercialLimit && (
                        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-5">
                          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-warning">
                            Limite commerciale
                          </span>
                          <p className="mt-2 text-sm text-gris-light text-pretty">
                            {service.commercialLimit}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Colonne droite : public + CTA */}
                    <div className="flex flex-col gap-6">
                      {/* Public concerné */}
                      <div className="rounded-2xl border border-gris-dark/30 bg-noir-2 p-5">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
                          Public concerné
                        </span>
                        <ul className="mt-3 flex flex-col gap-2">
                          {service.targetAudience.map((aud) => (
                            <li key={aud} className="text-sm text-blanc-creme text-pretty">
                              → {aud}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Champs du formulaire dédié */}
                      <div className="rounded-2xl border border-gris-dark/30 bg-noir-2 p-5">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
                          Champs de qualification
                        </span>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {service.formFields.map((f) => (
                            <li
                              key={f}
                              className="rounded-full border border-gris-dark/30 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-gris"
                            >
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA principal + WhatsApp */}
                      <div className="flex flex-col gap-3">
                        <Link
                          href={`/contact?service=${encodeURIComponent(service.title)}`}
                          className="btn-primary btn-shimmer justify-center"
                        >
                          {service.cta}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                        <a
                          href={whatsappLink(undefined, service.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-whatsapp btn-shimmer justify-center"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* FAQ */}
                  {service.faq.length > 0 && (
                    <div className="mt-8 rounded-2xl border-t border-gris-dark/30 pt-6">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
                        FAQ rapide
                      </span>
                      <dl className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {service.faq.map((item) => (
                          <div key={item.question} className="rounded-2xl border border-gris-dark/30 bg-noir-2 p-4">
                            <dt className="font-serif text-base font-bold text-blanc-creme text-pretty">
                              {item.question}
                            </dt>
                            <dd className="mt-2 text-sm text-gris-light text-pretty">
                              {item.answer}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {/* Séparateur */}
                  {idx < services.length - 1 && (
                    <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-gris-dark/40 to-transparent" />
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

