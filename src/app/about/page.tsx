import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { values, techStack } from "@/data/values";
import { siteConfig } from "@/data/site";
import {
  Star,
  Eye,
  ShieldCheck,
  Sparkles,
  Zap,
  Heart,
  Handshake,
  Ruler,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Une agence digitale née à Parakou, du service de proximité aux applications SaaS et à l'IA appliquée.",
  alternates: { canonical: "https://yehiortech.com/about" },
};

const iconMap: Record<string, LucideIcon> = {
  Star,
  Eye,
  ShieldCheck,
  Sparkles,
  Zap,
  Heart,
  Handshake,
  Ruler,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        tag="À propos"
        title="À propos de YEHI OR Tech"
        subtitle="Une entreprise numérique construite depuis Parakou, pensée pour structurer et accélérer la transformation digitale des organisations."
        image="https://images.unsplash.com/photo-1522071820088-cd2d915a32e5?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Notre histoire */}
      <section className="py-20">
        <div className="container-x max-w-4xl">
          <span className="section-tag">Notre histoire</span>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <p className="text-base text-blanc-creme text-pretty">
                YEHI OR Tech démarre à Parakou comme un centre de services numériques
                et d'impression de proximité : photocopie, impression, saisie,
                personnalisation. Pas de levée de fonds, pas de promesse en l'air,
                un service utile vendu chaque jour à ceux qui en ont besoin.
              </p>
              <p className="mt-4 text-base text-gris-light text-pretty">
                Les revenus de cette activité financent, étape par étape, la montée
                en gamme vers les applications SaaS, les agents IA et l'automatisation
                que tu vois sur ce site. C'est un choix : construire un socle solide
                avant de monter en technicité, plutôt que l'inverse.
              </p>
              <p className="mt-4 text-base text-gris-light text-pretty">
                <span className="text-or">YEHI OR</span> signifie{" "}
                <span className="text-blanc-creme">« Que la lumière soit »</span> en
                hébreu. Lumière, clarté, transformation, excellence et impact : ce
                que cette entreprise entend incarner dans chaque mission.
              </p>
            </div>
            <aside className="border border-or/20 bg-bleu-nuit/30 p-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris">
                Carte d'identité
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
            <div className="border-l-2 border-or bg-noir-2 p-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-or">
                Mission
              </span>
              <p className="mt-3 font-display text-2xl font-medium text-blanc-creme text-pretty">
                Donner aux organisations un accès à des solutions numériques
                professionnelles, accessibles, et réellement utiles à leur croissance.
              </p>
            </div>
            <div className="border-l-2 border-bleu-electrique bg-noir-2 p-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-bleu-electrique">
                Vision
              </span>
              <p className="mt-3 font-display text-2xl font-medium text-blanc-creme text-pretty">
                Devenir une référence de la transformation digitale et de l'IA
                appliquée en Afrique francophone, et au-delà.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 border-t border-gris-dark/20">
        <div className="container-x">
          <div className="text-center">
            <span className="section-tag justify-center">Valeurs</span>
            <h2 className="mt-4 font-display text-display-3 font-medium text-blanc-creme">
              Huit principes, un seul standard
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = iconMap[value.icon] ?? Star;
              return (
                <article
                  key={value.number}
                  className="card-base border-top-gold group p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center border border-or/20 bg-bleu-nuit/50 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5 w-5 text-or" aria-hidden />
                    </div>
                    <span className="font-mono text-xs text-gris">{value.number}</span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-blanc-creme transition-colors duration-300 group-hover:text-or">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-gris-light text-pretty">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stack technologique */}
      <section className="py-20 border-t border-gris-dark/20 bg-bleu-nuit/20">
        <div className="container-x">
          <div className="text-center">
            <span className="section-tag justify-center">Stack technologique</span>
            <h2 className="mt-4 font-display text-display-3 font-medium text-blanc-creme">
              Les outils qu'on utilise tous les jours
            </h2>
            <p className="mt-3 text-sm text-gris max-w-xl mx-auto text-pretty">
              Pas une liste pour impressionner. Chaque outil ci-dessous est réellement utilisé en production.
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {techStack.map((tech) => (
              <li
                key={tech.name}
                className="group border border-gris-dark/30 bg-noir-2 p-4 text-center transition-all duration-300 hover:border-or/40 hover:bg-bleu-nuit/30"
              >
                <p className="font-display text-lg font-medium text-blanc-creme transition-colors duration-300 group-hover:text-or">
                  {tech.name}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gris">
                  {tech.category}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-gris-dark/20">
        <div className="container-x text-center">
          <Link href="/contact" className="btn-primary">
            Travailler avec nous
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
