/**
 * Projets du portfolio YEHI OR Tech.
 * Aucun projet n'est présenté comme "terminé" : la transparence sur le statut
 * "en développement" est elle-même un argument de crédibilité.
 */

export type ProjectStatus = "live" | "development" | "concept";

export type Project = {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  statusLabel: string;
  gradient: string;
  emoji: string;
  tech: string[];
};

export const projects: Project[] = [
  {
    id: "academia",
    title: "Academia",
    category: "Application SaaS",
    categorySlug: "applications",
    description:
      "Gestion complète d'établissement scolaire : inscriptions, notes, communication parents, facturation.",
    tags: ["SaaS", "Éducation", "Bénin"],
    status: "development",
    statusLabel: "En développement",
    gradient: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)",
    emoji: "🎓",
    tech: ["Next.js", "Node.js", "PostgreSQL"],
  },
  {
    id: "medihelm",
    title: "MédiHelm",
    category: "Application SaaS",
    categorySlug: "applications",
    description:
      "Gestion de pharmacie de la commande fournisseur à la vente comptoir, avec suivi des stocks.",
    tags: ["SaaS", "Santé", "Pharmacie"],
    status: "development",
    statusLabel: "En développement",
    gradient: "linear-gradient(135deg, #1464F4 0%, #0D1117 100%)",
    emoji: "💊",
    tech: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: "travelhelm",
    title: "Travel Helm",
    category: "Application SaaS",
    categorySlug: "applications",
    description:
      "Marketplace B2B et B2C pour compagnies de bus : réservation, billetterie, gestion de flotte.",
    tags: ["SaaS", "Transport", "Marketplace"],
    status: "development",
    statusLabel: "En développement",
    gradient: "linear-gradient(135deg, #0B3D91 0%, #071A2F 100%)",
    emoji: "🚌",
    tech: ["Next.js", "PostgreSQL"],
  },
  {
    id: "numeriseal-benin",
    title: "NumériSeal Bénin",
    category: "Civic Tech",
    categorySlug: "applications",
    description:
      "Plateforme de certification et de vérification de documents pour les administrations.",
    tags: ["Civic Tech", "Vérification", "Administration"],
    status: "development",
    statusLabel: "En développement",
    gradient: "linear-gradient(135deg, #4B5563 0%, #0D1117 100%)",
    emoji: "🛡️",
    tech: ["Next.js 14", "NestJS", "PostgreSQL"],
  },
  {
    id: "afribayit",
    title: "AfriBayit",
    category: "Proptech",
    categorySlug: "applications",
    description:
      "Plateforme de gestion et de mise en relation immobilière pour le marché ouest-africain.",
    tags: ["Proptech", "Immobilier", "Marketplace"],
    status: "development",
    statusLabel: "En développement",
    gradient: "linear-gradient(135deg, #C88000 0%, #0D1117 100%)",
    emoji: "🏠",
    tech: ["React", "Node.js"],
  },
  {
    id: "yehi-or-editions",
    title: "YEHI OR Éditions",
    category: "Édition et formation",
    categorySlug: "design",
    description:
      "Publication de supports pédagogiques et d'enseignement en français, déjà en diffusion.",
    tags: ["Édition", "Pédagogie", "Actif"],
    status: "live",
    statusLabel: "Actif",
    gradient: "linear-gradient(135deg, #F5B700 0%, #C88000 100%)",
    emoji: "📚",
    tech: ["Publication", "Pédagogie"],
  },
];

export const portfolioFilters: { label: string; value: string }[] = [
  { label: "Tous", value: "tous" },
  { label: "Sites web", value: "sites-web" },
  { label: "Applications", value: "applications" },
  { label: "Design", value: "design" },
  { label: "Agents IA", value: "agents-ia" },
  { label: "Automatisation", value: "automatisation" },
  { label: "Crédibilité", value: "credibilite" },
];
