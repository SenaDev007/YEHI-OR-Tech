"use client";

import { ContentManager } from "@/components/manager/ContentManager";

type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  description: string;
  tags: string[];
  status: string;
  statusLabel: string;
  gradient: string;
  iconName: string;
  tech: string[];
  url: string;
  previewImage: string;
  isActive: boolean;
  order: number;
};

export default function PortfolioContentPage() {
  return (
    <ContentManager
      tag="Contenu public"
      title="Portfolio"
      subtitle="Réalisations affichées sur /portfolio. Seuls les projets actifs et 'live' sont visibles publiquement."
      apiPath="/api/content/portfolio"
      fields={[
        { name: "slug", label: "Slug", type: "text", placeholder: "academia-helm" },
        { name: "title", label: "Titre", type: "text" },
        { name: "category", label: "Catégorie", type: "text", placeholder: "Application SaaS" },
        { name: "categorySlug", label: "Slug catégorie", type: "text", default: "applications" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "tags", label: "Tags (un par ligne)", type: "list", default: [] },
        { name: "status", label: "Statut (live | development | concept)", type: "text", default: "live" },
        { name: "statusLabel", label: "Label statut", type: "text", default: "En production" },
        { name: "iconName", label: "Icône Lucide", type: "text", default: "Code" },
        { name: "tech", label: "Stack technique (un par ligne)", type: "list", default: [] },
        { name: "url", label: "URL du projet", type: "text", placeholder: "https://..." },
        { name: "previewImage", label: "URL image aperçu", type: "text" },
        { name: "gradient", label: "Gradient CSS", type: "text", default: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)" },
        { name: "isActive", label: "Actif", type: "boolean", default: true },
        { name: "order", label: "Ordre d'affichage", type: "number", default: 0 },
      ]}
      itemLabel={(item) => String(item.title || "Sans titre")}
      renderItem={(item) => {
        const p = item as PortfolioItem;
        return (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-serif text-lg font-bold text-blanc-creme">{p.title}</span>
              <span className="rounded-full bg-or/10 border border-or/30 px-2 py-0.5 font-sans text-[9px] uppercase text-or">
                {p.statusLabel || p.status}
              </span>
              {!p.isActive && (
                <span className="rounded-full bg-gris-dark/30 px-2 py-0.5 font-sans text-[9px] uppercase text-gris">Inactif</span>
              )}
            </div>
            <p className="text-xs text-gris-light line-clamp-2 text-pretty">{p.description}</p>
            <div className="mt-2 flex items-center gap-3 text-[10px] text-gris">
              <span>/{p.slug}</span>
              <span>·</span>
              <span>{p.category}</span>
              {p.url && (<><span>·</span><a href={p.url} target="_blank" rel="noreferrer" className="text-or hover:underline">Voir le site ↗</a></>)}
            </div>
          </div>
        );
      }}
    />
  );
}
