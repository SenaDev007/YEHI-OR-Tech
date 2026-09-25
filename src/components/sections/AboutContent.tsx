"use client";

import { motion } from "framer-motion";
import { usePageContent } from "@/lib/use-page-content";
import { useContent } from "@/lib/use-content";
import { siteConfig } from "@/data/site";
import type { Value } from "@/data/values";
import { techStack } from "@/data/values";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import {
  Star, Eye, ShieldCheck, Sparkles, Zap, Heart, Handshake, Ruler,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Star, Eye, ShieldCheck, Sparkles, Zap, Heart, Handshake, Ruler,
};

const DEFAULTS = {
  intro_title: "Notre histoire",
  intro_p1: "YEHI OR Tech démarre à Parakou comme un centre de services numériques et d'impression de proximité : photocopie, impression, saisie, personnalisation. Pas de levée de fonds, pas de promesse en l'air, un service utile vendu chaque jour à ceux qui en ont besoin.",
  intro_p2: "Les revenus de cette activité financent, étape par étape, la montée en gamme vers les applications SaaS, les agents IA et l'automatisation que tu vois sur ce site. C'est un choix : construire un socle solide avant de monter en technicité, plutôt que l'inverse.",
  intro_p3: "YEHI OR signifie « Que la lumière soit » en hébreu. Lumière, clarté, transformation, excellence et impact : ce que cette entreprise entend incarner dans chaque mission.",
  mission_title: "Mission",
  mission_text: "Donner aux organisations un accès à des solutions numériques professionnelles, accessibles, et réellement utiles à leur croissance.",
  vision_title: "Vision",
  vision_text: "Devenir une référence de la transformation digitale et de l'IA appliquée en Afrique francophone, et au-delà.",
  values_tag: "Valeurs",
  values_title: "Huit principes, un seul standard",
  tech_tag: "Stack technologique",
  tech_title: "Les outils qu'on utilise tous les jours",
  tech_description: "Pas une liste pour impressionner. Chaque outil ci-dessous est réellement utilisé en production.",
  identity_title: "Carte d'identité",
};

function loadStaticValues() {
  return import("@/data/values").then((m) => m.values);
}

/**
 * Section "Notre histoire" + "Mission/Vision" + "Valeurs" + "Stack"
 * de la page About — textes éditables depuis /manager/page-content.
 * Valeurs éditables depuis /manager/values-content.
 */
export function AboutContent() {
  const { content } = usePageContent("about");
  const { data: values } = useContent<Value[]>("/api/leads/values", loadStaticValues);

  const c = (key: keyof typeof DEFAULTS) => content[key] || DEFAULTS[key];

  return (
    <>
      {/* Notre histoire */}
      <section className="py-20">
        <div className="container-x max-w-4xl">
          <span className="section-tag">{c("intro_title")}</span>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <p className="text-base text-blanc-creme text-pretty">
                {c("intro_p1")}
              </p>
              <p className="mt-4 text-base text-gris-light text-pretty">
                {c("intro_p2")}
              </p>
              <p className="mt-4 text-base text-gris-light text-pretty">
                <span className="text-or">YEHI OR</span> signifie{" "}
                <span className="text-blanc-creme">« Que la lumière soit »</span> en hébreu.{" "}
                {c("intro_p3").replace(/^.*en hébreu\.\s*/, "")}
              </p>
            </div>
            <aside className="rounded-2xl border border-or/20 bg-bleu-nuit/30 p-6">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
                {c("identity_title")}
              </span>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gris">Fondateur</dt>
                  <dd className="text-blanc-creme text-right">{siteConfig.founder}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gris">Siège</dt>
                  <dd className="text-blanc-creme text-right">{siteConfig.city}, {siteConfig.country}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gris">Domaine</dt>
                  <dd className="text-blanc-creme text-right">{siteConfig.domain}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gris">Signification</dt>
                  <dd className="text-or text-right">« Que la lumière soit »</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-20 border-t border-gris-dark/20 bg-bleu-nuit/20">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border-l-2 border-or bg-noir-2 p-8">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-or">
                {c("mission_title")}
              </span>
              <p className="mt-3 font-serif text-2xl font-bold text-blanc-creme text-pretty">
                {c("mission_text")}
              </p>
            </div>
            <div className="rounded-2xl border-l-2 border-bleu-electrique bg-noir-2 p-8">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-bleu-electrique">
                {c("vision_title")}
              </span>
              <p className="mt-3 font-serif text-2xl font-bold text-blanc-creme text-pretty">
                {c("vision_text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs — titre éditable + contenu depuis /manager/values-content */}
      <section className="py-20 border-t border-gris-dark/20">
        <div className="container-x">
          <SectionHeader tag={c("values_tag")} title={c("values_title")} />

          {values && values.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {values.map((value, idx) => {
                const Icon = iconMap[value.icon] ?? Star;
                return (
                  <motion.article
                    key={value.number || idx}
                    variants={fadeInUp}
                    transition={{ delay: idx * 0.05 }}
                    className="card-base border-top-gold group p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-or/20 bg-bleu-nuit/50 transition-transform duration-500 group-hover:scale-110">
                        <Icon className="h-5 w-5 text-or" aria-hidden />
                      </div>
                      <span className="font-sans text-xs font-bold text-gris">{value.number}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-blanc-creme transition-colors duration-300 group-hover:text-or">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm text-gris-light text-pretty">
                      {value.description}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stack technologique — titre éditable + contenu statique */}
      <section className="py-20 border-t border-gris-dark/20 bg-bleu-nuit/20">
        <div className="container-x">
          <SectionHeader
            tag={c("tech_tag")}
            title={c("tech_title")}
            description={c("tech_description")}
          />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {techStack.map((tech) => (
              <li
                key={tech.name}
                className="group rounded-2xl border border-gris-dark/30 bg-noir-2 p-4 text-center transition-all duration-300 hover:border-or/40 hover:bg-bleu-nuit/30"
              >
                <p className="font-serif text-lg font-bold text-blanc-creme transition-colors duration-300 group-hover:text-or">
                  {tech.name}
                </p>
                <p className="mt-1 font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
                  {tech.category}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
