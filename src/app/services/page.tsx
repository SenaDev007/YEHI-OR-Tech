import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesDetailList } from "@/components/sections/ServicesDetailList";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Informatique & assistance, développement logiciel, Academia, infographie, impression, rédaction, IA & automatisation, conseil & formation — 8 pôles pour ton activité.",
  alternates: { canonical: "https://yehiortech.com/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        pageKey="services"
        tag="Services"
        title="Huit pôles. Du dépannage informatique à l'automatisation."
        subtitle="Pour chacun : une disponibilité claire — immédiate, sur devis, ou produit en production. Aucune promesse vague, aucun service caché derrière un autre."
        image="https://images.unsplash.com/photo-1551434678-e076c22a9b78?auto=format&fit=crop&w=1920&q=80"
      />
      <ServicesDetailList />
    </>
  );
}
