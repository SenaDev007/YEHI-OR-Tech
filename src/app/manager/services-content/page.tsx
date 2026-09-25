"use client";

import { ContentManager } from "@/components/manager/ContentManager";

type ServiceItem = {
  id: string;
  slug: string;
  number: string;
  title: string;
  icon: string;
  tagline: string;
  availability: string;
  availabilityLabel: string;
  problem: string;
  fullDescription: string;
  deliverables: string[];
  targetAudience: string[];
  cta: string;
  gradient: string;
  isActive: boolean;
  order: number;
};

export default function ServicesContentPage() {
  return (
    <ContentManager
      tag="Contenu public"
      title="Services"
      subtitle="Les services affichés sur la homepage et /services. Édite, réordonne, active/désactive."
      apiPath="/api/content/services"
      fields={[
        { name: "slug", label: "Slug (URL)", type: "text", placeholder: "informatique-assistance" },
        { name: "number", label: "Numéro d'ordre", type: "text", placeholder: "01" },
        { name: "title", label: "Titre", type: "text" },
        { name: "icon", label: "Icône Lucide", type: "text", placeholder: "Wrench", default: "Code" },
        { name: "tagline", label: "Tagline", type: "text" },
        { name: "availability", label: "Disponibilité (clé)", type: "text", default: "sur-devis" },
        { name: "availabilityLabel", label: "Disponibilité (label)", type: "text", default: "Sur devis" },
        { name: "problem", label: "Problème résolu", type: "textarea" },
        { name: "fullDescription", label: "Description complète", type: "textarea" },
        { name: "deliverables", label: "Livrables (un par ligne)", type: "list", default: [] },
        { name: "targetAudience", label: "Audience cible (un par ligne)", type: "list", default: [] },
        { name: "cta", label: "Call-to-action", type: "text", default: "Démarrer ce service →" },
        { name: "gradient", label: "Gradient CSS", type: "text", default: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)" },
        { name: "isActive", label: "Actif", type: "boolean", default: true },
        { name: "order", label: "Ordre d'affichage", type: "number", default: 0 },
      ]}
      itemLabel={(item) => String(item.title || "Sans titre")}
      renderItem={(item) => {
        const s = item as ServiceItem;
        return (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-sans text-xs font-bold text-or">{s.number || "—"}</span>
              <span className="font-serif text-lg font-bold text-blanc-creme">{s.title}</span>
              {!s.isActive && (
                <span className="rounded-full bg-gris-dark/30 px-2 py-0.5 font-sans text-[9px] uppercase text-gris">
                  Inactif
                </span>
              )}
            </div>
            <p className="text-xs text-gris-light">{s.tagline}</p>
            <div className="mt-2 flex items-center gap-3 text-[10px] text-gris">
              <span>/{s.slug}</span>
              <span>·</span>
              <span>{s.deliverables?.length || 0} livrables</span>
            </div>
          </div>
        );
      }}
    />
  );
}
