export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: "live" | "development" | "concept";
  thumbnail?: string;
  gradient: string;
  emoji: string;
  tech: string[];
};

export const projects: Project[] = [
  {
    id: "academia-helm",
    title: "Academia Helm",
    category: "Application SaaS",
    description: "Système complet de gestion scolaire (ERP) pour les établissements d'enseignement.",
    tags: ["SaaS", "Éducation", "ERP"],
    status: "development",
    emoji: "🎓",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Prisma"],
    gradient: "linear-gradient(135deg, #2C1A2C 0%, #0D1117 100%)"
  },
  {
    id: "medihelm",
    title: "MédiHelm",
    category: "Application SaaS",
    description: "Plateforme de gestion pour les cliniques et cabinets médicaux.",
    tags: ["SaaS", "Santé", "Gestion"],
    status: "development",
    emoji: "💊",
    tech: ["React", "Node.js", "PostgreSQL"],
    gradient: "linear-gradient(135deg, #0D1117 0%, #071A2F 100%)"
  },
  {
    id: "travel-helm",
    title: "Travel Helm",
    category: "Application SaaS",
    description: "Solution de gestion pour les agences de voyage et de transport.",
    tags: ["SaaS", "Voyage", "Transport"],
    status: "development",
    emoji: "✈️",
    tech: ["Next.js", "PostgreSQL"],
    gradient: "linear-gradient(135deg, #1A2744 0%, #080A0F 100%)"
  },
  {
    id: "numeriseal-benin",
    title: "NumériSeal Bénin",
    category: "Civic Tech",
    description: "Plateforme de certification et de vérification de documents officiels.",
    tags: ["Civic Tech", "Sécurité", "Bénin"],
    status: "development",
    emoji: "🛡️",
    tech: ["Next.js 14", "NestJS", "PostgreSQL"],
    gradient: "linear-gradient(135deg, #071A2F 0%, #141921 100%)"
  },
  {
    id: "afribayit",
    title: "AfriBayit",
    category: "Proptech",
    description: "Solution immobilière adaptée aux réalités du marché africain.",
    tags: ["Proptech", "Immobilier", "Afrique"],
    status: "development",
    emoji: "🏠",
    tech: ["React", "Node.js"],
    gradient: "linear-gradient(135deg, #2C1A2C 0%, #080A0F 100%)"
  },
  {
    id: "yehi-or-editions",
    title: "YEHI OR Éditions",
    category: "Édition & Formation",
    description: "Plateforme de publication et de partage de connaissances.",
    tags: ["Édition", "Pédagogie", "Contenu"],
    status: "live",
    emoji: "📚",
    tech: ["Publication", "Formation"],
    gradient: "linear-gradient(135deg, #1A2744 0%, #0D1117 100%)"
  }
];
