"use client";

import { ContentManager } from "@/components/manager/ContentManager";

type StatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  meaning: string;
  section: string;
  order: number;
  isActive: boolean;
};

export default function StatsContentPage() {
  return (
    <ContentManager
      tag="Contenu public"
      title="Statistiques"
      subtitle="Métriques animées affichées sur la homepage."
      apiPath="/api/content/stats"
      fields={[
        { name: "value", label: "Valeur", type: "number" },
        { name: "suffix", label: "Suffixe (ex: h, %, +)", type: "text", placeholder: "+" },
        { name: "label", label: "Label", type: "text" },
        { name: "meaning", label: "Description", type: "textarea" },
        { name: "section", label: "Section (homepage | whyChooseUs)", type: "text", default: "homepage" },
        { name: "order", label: "Ordre d'affichage", type: "number", default: 0 },
        { name: "isActive", label: "Actif", type: "boolean", default: true },
      ]}
      itemLabel={(item) => String(item.label || "Sans label")}
      renderItem={(item) => {
        const s = item as StatItem;
        return (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-serif text-2xl font-bold text-or">{s.value}{s.suffix || ""}</span>
              <span className="font-sans text-sm font-bold text-blanc-creme">{s.label}</span>
              {!s.isActive && (
                <span className="rounded-full bg-gris-dark/30 px-2 py-0.5 font-sans text-[9px] uppercase text-gris">Inactif</span>
              )}
            </div>
            {s.meaning && <p className="text-xs text-gris-light line-clamp-2">{s.meaning}</p>}
            <div className="mt-1 text-[10px] text-gris">Section : {s.section}</div>
          </div>
        );
      }}
    />
  );
}
