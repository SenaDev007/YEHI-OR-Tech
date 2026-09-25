import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { AboutContent } from "@/components/sections/AboutContent";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Une agence digitale née à Parakou, du service de proximité aux applications SaaS et à l'IA appliquée.",
  alternates: { canonical: "https://yehiortech.com/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        pageKey="about"
        tag="À propos"
        title="À propos de YEHI OR Tech"
        subtitle="Une entreprise numérique construite depuis Parakou, pensée pour structurer et accélérer la transformation digitale des organisations."
        image="https://images.unsplash.com/photo-1522071820088-cd2d915a32e5?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Section Notre histoire + Mission/Vision + Valeurs + Stack */}
      {/* Tous les textes éditables depuis /manager/page-content */}
      {/* Valeurs (numérotées) éditables depuis /manager/values-content */}
      <AboutContent />

      {/* CTA */}
      <section className="py-20 border-t border-gris-dark/20">
        <div className="container-x text-center">
          <Link href="/contact" className="btn-primary btn-shimmer">
            Travailler avec nous
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
