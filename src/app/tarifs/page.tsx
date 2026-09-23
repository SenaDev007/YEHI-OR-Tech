import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { PricingCard } from "@/components/ui/PricingCard";
import { PricingFAQ } from "@/components/ui/PricingFAQ";
import { packs } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Tarifs et packs",
  description:
    "Pack Start à 35 000 FCFA, Pack Business à 50 000 FCFA. Emails pro, Google Maps, référencement local. Prix clairs, sans surprise.",
  alternates: { canonical: "https://yehiortech.com/tarifs" },
};

export default function TarifsPage() {
  return (
    <>
      <PageHero
        tag="Tarifs & Packs"
        title="Des prix clairs, des livrables précis"
        subtitle="Pas de surprise à la facture. Chaque pack liste exactement ce qui est inclus."
      />

      {/* Packs principaux */}
      <section className="py-20">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 max-w-4xl mx-auto">
            {packs.map((pack, idx) => (
              <PricingCard
                key={pack.id}
                pack={pack}
                side={idx === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-gris-dark/20">
        <div className="container-x max-w-3xl">
          <span className="section-tag mb-4">FAQ</span>
          <h2 className="mt-4 font-display text-display-3 font-medium text-blanc-creme">
            Questions fréquentes
          </h2>
          <div className="mt-8">
            <PricingFAQ />
          </div>
        </div>
      </section>

      {/* CTA bas de page */}
      <section className="py-20 border-t border-gris-dark/20 bg-bleu-nuit/30">
        <div className="container-x max-w-3xl text-center">
          <span className="section-tag mb-4 justify-center">Sur mesure</span>
          <h2 className="mt-4 font-display text-display-3 font-medium text-blanc-creme">
            Besoin d'une offre sur mesure ?
          </h2>
          <p className="mt-4 text-base text-gris-light text-pretty">
            Écris-nous ton besoin et ton budget. On revient avec un devis adapté,
            pas un tarif générique copié-collé.
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            Demander un devis personnalisé
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
