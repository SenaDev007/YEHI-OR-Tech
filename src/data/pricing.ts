/**
 * Packs tarifaires YEHI OR Tech.
 * Prix en FCFA, affichés en clair — aucune ambiguïté sur ce qui est inclus.
 */

export type PackColor = "blue" | "gold" | "dark" | "green";
export type PackCategory = "credibilite" | "web" | "application" | "ia" | "impression";

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
  // Packs Sites Web
  {
    id: "pack-site-vitrine",
    name: "Pack Site Vitrine",
    price: 150000,
    currency: "FCFA",
    badge: "WEB",
    badgeColor: "blue",
    tagline: "Site vitrine professionnel, rapide et responsive, optimisé pour Google.",
    features: [
      "Jusqu'à 6 pages (Accueil, À propos, Services, Tarifs, Blog, Contact)",
      "Design sur-mesure adapté à ton activité",
      "Responsive mobile + tablet + desktop",
      "Optimisation SEO de base (meta, sitemap, robots.txt)",
      "Formulaire de contact intégré",
      "Intégration Google Analytics",
      "Hébergement et nom de domaine configurés (1 an)",
    ],
    cta: "Démarrer mon site",
    color: "blue",
    category: "web",
    deliveryTime: "2 à 3 semaines",
    supportIncluded: "60 jours de support inclus",
  },
  {
    id: "pack-landing-page",
    name: "Pack Landing Page",
    price: 75000,
    currency: "FCFA",
    badge: "LANDING",
    badgeColor: "blue",
    tagline: "Une page unique conçue pour convertir les visiteurs en contacts.",
    features: [
      "Une page unique (design high-conversion)",
      "Copywriting persuasif inclus",
      "Animations au scroll premium",
      "Formulaire de capture multi-champs",
      "Intégration réseaux sociaux",
      "Optimisation SEO + performance",
    ],
    cta: "Lancer ma landing page",
    color: "blue",
    category: "web",
    deliveryTime: "5 à 10 jours",
    supportIncluded: "30 jours de support inclus",
  },
  // Packs Applications
  {
    id: "pack-app-web",
    name: "Pack Application Web",
    price: 500000,
    currency: "FCFA",
    badge: "APP",
    badgeColor: "blue",
    tagline: "Application web sur-mesure : back-office, dashboard, gestion métier.",
    features: [
      "Application web sur-mesure (jusqu'à 5 modules)",
      "Authentification sécurisée + rôles utilisateurs",
      "Base de données PostgreSQL",
      "Tableau de bord + reporting",
      "API sécurisée REST ou tRPC",
      "Tests + documentation technique",
      "Formation utilisateurs (3h)",
    ],
    cta: "Cadrer mon application",
    color: "blue",
    category: "application",
    deliveryTime: "6 à 10 semaines",
    supportIncluded: "90 jours de support inclus",
  },
  // Packs IA & Automatisation
  {
    id: "pack-agent-ia-whatsapp",
    name: "Pack Agent IA WhatsApp",
    price: 200000,
    currency: "FCFA",
    badge: "IA",
    badgeColor: "gold",
    tagline: "Agent conversationnel IA sur WhatsApp Business 24h/24.",
    features: [
      "Configuration WhatsApp Business API",
      "Agent IA entraîné sur ton activité (FAQ, services, prix)",
      "Qualification automatique des prospects",
      "Transfert vers humain si nécessaire",
      "Tableau de bord des conversations",
      "Intégration CRM (optionnel)",
    ],
    cta: "Activer mon agent IA",
    color: "gold",
    category: "ia",
    deliveryTime: "2 à 4 semaines",
    supportIncluded: "60 jours de support inclus",
  },
  {
    id: "pack-automatisation",
    name: "Pack Automatisation Métier",
    price: 120000,
    currency: "FCFA",
    badge: "AUTO",
    badgeColor: "blue",
    tagline: "Automatise tes tâches répétitives : relances, notifications, sync.",
    features: [
      "Audit des tâches automatisables",
      "Jusqu'à 5 workflows (n8n ou Zapier)",
      "Connexion entre tes outils existants",
      "Notifications WhatsApp/Email automatiques",
      "Documentation des workflows",
      "Tableau de bord de suivi",
    ],
    cta: "Auditer mes tâches",
    color: "blue",
    category: "ia",
    deliveryTime: "2 à 3 semaines",
    supportIncluded: "30 jours de support inclus",
  },
  // Packs Impression
  {
    id: "pack-impression-base",
    name: "Pack Impression Express",
    price: 1000,
    currency: "FCFA",
    badge: "PRINT",
    badgeColor: "dark",
    tagline: "Photocopies, impressions couleur, scan — disponible immédiatement à Parakou.",
    features: [
      "Photocopies N&B (à partir de 25 FCFA/page)",
      "Impressions couleur (à partir de 75 FCFA/page)",
      "Scan et conversion PDF",
      "Agrafage, perforation, finition",
      "Envoi par WhatsApp ou email",
      "Disponibilité immédiate sans rendez-vous",
    ],
    cta: "Commander une impression",
    color: "dark",
    category: "impression",
    deliveryTime: "Immédiat",
    supportIncluded: "",
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
