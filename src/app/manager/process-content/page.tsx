"use client";

import { ContentManager } from "@/components/manager/ContentManager";

type ProcessItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
};

export default function ProcessContentPage() {
  return (
    <ContentManager
      tag="Contenu public"
      title="Processus"
      subtitle="Étapes du processus de travail affichées sur la homepage et À propos."
      apiPath="/api/content/process-steps"
      fields={[
        { name: "number", label: "Numéro d'ordre", type: "text", placeholder: "01" },
        { name: "title", label: "Titre", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "icon", label: "Icône Lucide", type: "text", default: "Search" },
        { name: "isActive", label: "Actif", type: "boolean", default: true },
        { name: "order", label: "Ordre d'affichage", type: "number", default: 0 },
      ]}
      itemLabel={(item) => String(item.title || "Sans titre")}
      renderItem={(item) => {
        const p = item as ProcessItem;
        return (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-sans text-xs font-bold text-or">{p.number || "—"}</span>
              <span className="font-serif text-lg font-bold text-blanc-creme">{p.title}</span>
              {!p.isActive && (
                <span className="rounded-full bg-gris-dark/30 px-2 py-0.5 font-sans text-[9px] uppercase text-gris">Inactif</span>
              )}
            </div>
            <p className="text-xs text-gris-light line-clamp-2 text-pretty">{p.description}</p>
            <div className="mt-1 text-[10px] text-gris">Icône: {p.icon}</div>
          </div>
        );
      }}
    />
  );
}
