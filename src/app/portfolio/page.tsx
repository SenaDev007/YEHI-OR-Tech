import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { PortfolioGridClient } from "@/components/sections/PortfolioGridClient";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Academia, MédiHelm, Travel Helm, NumériSeal Bénin, AfriBayit, YEHI OR Éditions — les projets SaaS et digitaux construits par YEHI OR Tech depuis le Bénin.",
  alternates: { canonical: "https://yehiortech.com/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        tag="Réalisations"
        title="Ce qu'on construit"
        subtitle="Six marques, un même standard d'exigence. La majorité est encore en construction, on le dit tel quel — la transparence est un argument de crédibilité."
      />

      <section className="py-20">
        <div className="container-x">
          {/* Stats globales */}
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatBlock label="Projets actifs" value="1" />
            <StatBlock label="Projets en développement" value="5" />
            <StatBlock label="Catégories couvertes" value="3" />
            <StatBlock label="Pays d'impact" value="Bénin" />
          </div>

          {/* Filtres + grille (client) */}
          <PortfolioGridClient projects={projects} />
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 border-t border-gris-dark/20 bg-bleu-nuit/30">
        <div className="container-x max-w-3xl text-center">
          <span className="section-tag mb-4 justify-center">Un projet en tête ?</span>
          <h2 className="mt-4 font-display text-display-3 font-medium text-blanc-creme">
            Parlons-en
          </h2>
          <Link href="/contact" className="btn-primary mt-8">
            Décris ton projet
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gris-dark/30 bg-noir-2 p-5 text-center">
      <p className="font-display text-3xl font-medium text-gradient-or">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gris">
        {label}
      </p>
    </div>
  );
}
