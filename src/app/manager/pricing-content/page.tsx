"use client";

import { ContentManager } from "@/components/manager/ContentManager";

type PricingItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  order: number;
};

export default function PricingContentPage() {
  return (
    <ContentManager
      tag="Contenu public"
      title="Packs Tarifs"
      subtitle="Packs affichés sur /tarifs. Prix en FCFA."
      apiPath="/api/content/pricing"
      fields={[
        { name: "slug", label: "Slug", type: "text", placeholder: "pack-start" },
        { name: "name", label: "Nom du pack", type: "text" },
        { name: "price", label: "Prix (FCFA)", type: "number" },
        { name: "period", label: "Période (mois/projet/one-shot)", type: "text", placeholder: "projet" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "features", label: "Fonctionnalités incluses (un par ligne)", type: "list", default: [] },
        { name: "isPopular", label: "Pack recommandé (badge)", type: "boolean", default: false },
        { name: "isActive", label: "Actif", type: "boolean", default: true },
        { name: "order", label: "Ordre d'affichage", type: "number", default: 0 },
      ]}
      itemLabel={(item) => String(item.name || "Sans nom")}
      renderItem={(item) => {
        const p = item as PricingItem;
        return (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-serif text-lg font-bold text-blanc-creme">{p.name}</span>
              {p.isPopular && (
                <span className="rounded-full bg-or/15 border border-or/40 px-2 py-0.5 font-sans text-[9px] uppercase text-or">
                  ★ Recommandé
                </span>
              )}
              {!p.isActive && (
                <span className="rounded-full bg-gris-dark/30 px-2 py-0.5 font-sans text-[9px] uppercase text-gris">Inactif</span>
              )}
            </div>
            <p className="font-serif text-xl text-or">{p.price?.toLocaleString("fr-FR") || 0} FCFA <span className="text-xs text-gris">/ {p.period || "—"}</span></p>
            <p className="text-xs text-gris-light line-clamp-2 text-pretty">{p.description}</p>
            <div className="mt-2 text-[10px] text-gris">{p.features?.length || 0} fonctionnalités incluses</div>
          </div>
        );
      }}
    />
  );
}
