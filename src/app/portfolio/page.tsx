import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { PortfolioGridClient } from "@/components/sections/PortfolioGridClient";
import { getVisibleProjects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Academia Helm, Win Agro, Foncier Facile Afrique — les plateformes en production construites par YEHI OR Tech.",
  alternates: { canonical: "https://yehiortech.com/portfolio" },
};

export default function PortfolioPage() {
  const visibleProjects = getVisibleProjects();

  return (
    <>
      <PageHero
        tag="Réalisations"
        title="Nos plateformes en production"
        subtitle="Ces plateformes sont déployées et utilisées en conditions réelles. Les projets en cours de développement sont masqués — la transparence prime sur la promesse."
        image="https://images.unsplash.com/photo-1620712947042-ab4d6807b9b1?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20">
        <div className="container-x">
          {/* Stats globales */}
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatBlock label="Plateformes en production" value={String(visibleProjects.length)} />
            <StatBlock label="Catégories couvertes" value="3" />
            <StatBlock label="Pays d'impact" value="Bénin" />
            <StatBlock label="Stack principal" value="Next.js" />
          </div>

          {/* Filtres + grille (client) */}
          <PortfolioGridClient />
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 border-t border-gris-dark/20 bg-bleu-nuit/30">
        <div className="container-x max-w-3xl text-center">
          <span className="section-tag mb-4 justify-center">Un projet en tête ?</span>
          <h2 className="mt-4 font-serif text-display-3 font-bold text-blanc-creme">
            Parlons-en
          </h2>
          <Link href="/contact" className="btn-primary btn-shimmer mt-8">
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
    <div className="rounded-2xl border border-gris-dark/30 bg-noir-2 p-5 text-center">
      <p className="font-serif text-3xl font-bold text-gradient-or">{value}</p>
      <p className="mt-1 font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
        {label}
      </p>
    </div>
  );
}
