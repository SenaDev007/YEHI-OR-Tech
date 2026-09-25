"use client";

import { ContentManager } from "@/components/manager/ContentManager";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
};

export default function FaqContentPage() {
  return (
    <ContentManager
      tag="Contenu public"
      title="FAQ globale"
      subtitle="Questions fréquentes affichées sur la homepage et les pages de service."
      apiPath="/api/content/faq"
      fields={[
        { name: "question", label: "Question", type: "text" },
        { name: "answer", label: "Réponse", type: "textarea" },
        { name: "category", label: "Catégorie (general | services | pricing)", type: "text", default: "general" },
        { name: "isActive", label: "Actif", type: "boolean", default: true },
        { name: "order", label: "Ordre d'affichage", type: "number", default: 0 },
      ]}
      itemLabel={(item) => String(item.question || "Sans question")}
      renderItem={(item) => {
        const f = item as FaqItem;
        return (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="rounded-full bg-or/10 border border-or/30 px-2 py-0.5 font-sans text-[9px] uppercase text-or">
                {f.category}
              </span>
              {!f.isActive && (
                <span className="rounded-full bg-gris-dark/30 px-2 py-0.5 font-sans text-[9px] uppercase text-gris">Inactif</span>
              )}
            </div>
            <p className="font-serif text-sm font-bold text-blanc-creme text-pretty">{f.question}</p>
            <p className="mt-1 text-xs text-gris-light line-clamp-2 text-pretty">{f.answer}</p>
          </div>
        );
      }}
    />
  );
}
