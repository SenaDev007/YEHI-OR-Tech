/**
 * Projets du portfolio YEHI OR Tech.
 * Seuls les projets en production (status "live") sont affichés publiquement.
 * Les projets en développement (status "development") sont masqués du site public.
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
  iconName: string; // Lucide icon name (remplace l'emoji)
  tech: string[];
  url?: string; // URL de la plateforme en production
  previewImage?: string; // Screenshot/preview de la plateforme
};

export const projects: Project[] = [
  // ============================================================
  // PLATEFORMES EN PRODUCTION — visibles publiquement
  // ============================================================
  {
    id: "academia-helm",
    title: "Academia Helm",
    category: "Application SaaS",
    categorySlug: "applications",
    description:
      "Plateforme de gestion scolaire : inscriptions, paiements, bulletins, communication parents, finances. Déployée et utilisée par des établissements.",
    tags: ["SaaS", "Éducation", "Production"],
    status: "live",
    statusLabel: "En production",
    gradient: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)",
    iconName: "GraduationCap",
    tech: ["Next.js", "Node.js", "PostgreSQL"],
    url: "https://academiahelm.com/",
    previewImage: "https://image.thum.io/get/width/800/crop/600/https://academiahelm.com/",
  },
  {
    id: "win-agro",
    title: "Win Agro",
    category: "Site web & e-commerce",
    categorySlug: "sites-web",
    description:
      "Plateforme de formation et d'élevage au Bénin. Vente de volailles, provendes, accompagnement terrain.",
    tags: ["Agriculture", "E-commerce", "Production"],
    status: "live",
    statusLabel: "En production",
    gradient: "linear-gradient(135deg, #076B37 0%, #0F1F14 100%)",
    iconName: "Sprout",
    tech: ["Next.js", "Prisma", "Tailwind"],
    url: "https://winagrotech.com/",
    previewImage: "https://image.thum.io/get/width/800/crop/600/https://winagrotech.com/",
  },
  {
    id: "foncier-facile-afrique",
    title: "Foncier Facile Afrique",
    category: "Plateforme civic tech",
    categorySlug: "applications",
    description:
      "Plateforme de gestion et de simplification des démarches foncières en Afrique francophone.",
    tags: ["Civic Tech", "Foncier", "Production"],
    status: "live",
    statusLabel: "En production",
    gradient: "linear-gradient(135deg, #0B3D91 0%, #0D1117 100%)",
    iconName: "Landmark",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    url: "https://www.foncierfacileafrique.fr/",
    previewImage: "https://image.thum.io/get/width/800/crop/600/https://www.foncierfacileafrique.fr/",
  },
  {
    id: "mouvement-christ-libere",
    title: "Mouvement Christ Libéré",
    category: "Site institutionnel",
    categorySlug: "sites-web",
    description:
      "Plateforme du Mouvement Christ Libéré : enseignements, événements, ressources spirituelles et communauté.",
    tags: ["Institutionnel", "Spiritualité", "Production"],
    status: "live",
    statusLabel: "En production",
    gradient: "linear-gradient(135deg, #076B37 0%, #07152D 100%)",
    iconName: "Church",
    tech: ["Next.js", "Tailwind", "TypeScript"],
    url: "https://www.mouvementchristlibere.com/",
    previewImage: "https://image.thum.io/get/width/800/crop/600/https://www.mouvementchristlibere.com/",
  },

  // ============================================================
  // PROJETS EN DÉVELOPPEMENT — masqués du site public
  // (présents en DB pour gestion future via le CMS)
  // ============================================================
  // {
  //   id: "medihelm",
  //   title: "MédiHelm",
  //   ...
  //   status: "development",
  // },
  // {
  //   id: "travel-helm",
  //   title: "Travel Helm",
  //   ...
  //   status: "development",
  // },
  // {
  //   id: "numeriseal-benin",
  //   title: "NumériSeal Bénin",
  //   ...
  //   status: "development",
  // },
  // {
  //   id: "afribayit",
  //   title: "AfriBayit",
  //   ...
  //   status: "development",
  // },
];

/**
 * Filtre les projets visibles publiquement.
 * Renvoie uniquement les projets "live" (en production).
 */
export function getVisibleProjects(): Project[] {
  return projects.filter((p) => p.status === "live");
}

export const portfolioFilters: { label: string; value: string }[] = [
  { label: "Tous", value: "tous" },
  { label: "Sites web", value: "sites-web" },
  { label: "Applications", value: "applications" },
  { label: "Civic Tech", value: "civic-tech" },
];
