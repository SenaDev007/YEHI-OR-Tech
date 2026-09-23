/**
 * Packs tarifaires YEHI OR Tech.
 * Prix en FCFA, affichés en clair — aucune ambiguïté sur ce qui est inclus.
 */

export type PackColor = "blue" | "gold" | "dark" | "green";
export type PackCategory = "credibilite" | "web" | "application" | "ia";

export type Pack = {
  id: string;
  name: string;
  price: number;
  currency: "FCFA";
  badge?: string;
  badgeColor?: PackColor;
  recommended?: boolean;
  tagline: string;
  features: string[];
  featureDetails?: { label: string; detail: string }[];
  cta: string;
  color: PackColor;
  category: PackCategory;
  deliveryTime?: string;
  supportIncluded?: string;
};

export const packs: Pack[] = [
  {
    id: "pack-start",
    name: "Pack START",
    price: 35000,
    currency: "FCFA",
    badge: "START",
    badgeColor: "green",
    tagline: "Pose les fondations numériques de ton image de marque.",
    features: [
      "5 adresses email professionnelles",
      "Création et configuration de la fiche établissement Google Maps",
      "Indexation et référencement dans Google Search Console",
      "Inscription dans 3 annuaires professionnels ciblés",
      "Configuration des enregistrements DNS pour éviter les spams",
    ],
    featureDetails: [
      {
        label: "Emails pro",
        detail:
          "Serveur SMTP configuré, accès webmail, compatible Outlook/Gmail",
      },
      {
        label: "Google Maps",
        detail:
          "Fiche complète avec photos, horaires, description, catégorie",
      },
      {
        label: "Search Console",
        detail: "Propriété vérifiée, sitemaps soumis, suivi des positions",
      },
      {
        label: "Annuaires",
        detail: "Ciblés par secteur et localisation géographique",
      },
      {
        label: "DNS",
        detail: "Enregistrements SPF, DKIM, DMARC configurés",
      },
    ],
    cta: "Choisir le Pack Start",
    color: "dark",
    category: "credibilite",
    deliveryTime: "3 à 5 jours ouvrés",
    supportIncluded: "30 jours de support inclus",
  },
  {
    id: "pack-business",
    name: "Pack BUSINESS",
    price: 50000,
    currency: "FCFA",
    badge: "BUSINESS",
    badgeColor: "gold",
    recommended: true,
    tagline: "La crédibilité en ligne montée en gamme pour les structures qui grandissent.",
    features: [
      "25 adresses email professionnelles",
      "Création et configuration de la fiche établissement Google Maps",
      "Indexation et référencement dans Google Search Console",
      "Inscription dans 5 annuaires professionnels ciblés",
      "Configuration des enregistrements DNS pour éviter les spams",
    ],
    featureDetails: [
      {
        label: "Emails pro",
        detail:
          "Serveur SMTP configuré, accès webmail, compatible Outlook/Gmail",
      },
      {
        label: "Google Maps",
        detail:
          "Fiche complète avec photos, horaires, description, catégorie",
      },
      {
        label: "Search Console",
        detail: "Propriété vérifiée, sitemaps soumis, suivi des positions",
      },
      {
        label: "Annuaires",
        detail: "Ciblés par secteur et localisation géographique",
      },
      {
        label: "DNS",
        detail: "Enregistrements SPF, DKIM, DMARC configurés",
      },
    ],
    cta: "Choisir le Pack Business",
    color: "gold",
    category: "credibilite",
    deliveryTime: "3 à 5 jours ouvrés",
    supportIncluded: "30 jours de support inclus",
  },
];

export const pricingFaq: { question: string; answer: string }[] = [
  {
    question: "Quel est le délai de livraison ?",
    answer: "3 à 5 jours ouvrés.",
  },
  {
    question: "Que dois-tu fournir pour démarrer ?",
    answer:
      "Ton nom de domaine, ton logo si tu en as un, et les informations de base de ton entreprise.",
  },
  {
    question: "Le support est-il inclus après la livraison ?",
    answer: "Oui, 30 jours de support inclus dans les deux packs.",
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price);
}
