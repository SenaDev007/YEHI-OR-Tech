"use client";

import { ContentManager } from "@/components/manager/ContentManager";

type TestimonialItem = {
  id: string;
  text: string;
  highlight: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  rating: number;
  isActive: boolean;
  order: number;
};

export default function TestimonialsPage() {
  return (
    <ContentManager
      tag="Contenu public"
      title="Témoignages"
      subtitle="Témoignages clients affichés sur la homepage."
      apiPath="/api/content/testimonials"
      fields={[
        { name: "text", label: "Texte du témoignage", type: "textarea" },
        { name: "highlight", label: "Phrase mise en avant", type: "text", placeholder: "Ce qui doit être cité en gras" },
        { name: "authorName", label: "Nom de l'auteur", type: "text" },
        { name: "authorRole", label: "Rôle/Fonction", type: "text", placeholder: "Directeur · CSP Baobab" },
        { name: "authorAvatar", label: "URL avatar (optionnel)", type: "text" },
        { name: "rating", label: "Note (1-5)", type: "number", default: 5 },
        { name: "isActive", label: "Actif", type: "boolean", default: true },
        { name: "order", label: "Ordre d'affichage", type: "number", default: 0 },
      ]}
      itemLabel={(item) => String(item.authorName || "Sans auteur")}
      renderItem={(item) => {
        const t = item as TestimonialItem;
        return (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-serif text-lg font-bold text-blanc-creme">{t.authorName}</span>
              <span className="font-sans text-xs text-or">{"★".repeat(t.rating || 5)}</span>
              {!t.isActive && (
                <span className="rounded-full bg-gris-dark/30 px-2 py-0.5 font-sans text-[9px] uppercase text-gris">Inactif</span>
              )}
            </div>
            <p className="text-xs text-gris-light line-clamp-2 text-pretty">{t.text}</p>
            {t.highlight && <p className="mt-1 text-xs italic text-or">« {t.highlight} »</p>}
            <p className="mt-1 text-[10px] text-gris">{t.authorRole}</p>
          </div>
        );
      }}
    />
  );
}
