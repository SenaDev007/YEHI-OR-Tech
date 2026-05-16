export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: "live" | "development" | "concept";
  link: string;
  thumbnail?: string;
  gradient: string;
  emoji: string;
  tech: string[];
};

export const projects: Project[] = [
  {
    id: "academia-helm",
    title: "Academia Helm",
    category: "Applications SaaS",
    description: "Système complet de gestion scolaire (ERP) pour les établissements d'enseignement, optimisant l'administration et le suivi pédagogique.",
    tags: ["SaaS", "Éducation", "ERP"],
    status: "live",
    link: "https://www.academiahelm.com/",
    emoji: "🎓",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Prisma"],
    gradient: "linear-gradient(135deg, #2C1A2C 0%, #0D1117 100%)"
  },
  {
    id: "foncier-facile",
    title: "Foncier Facile Afrique",
    category: "Sites Web",
    description: "Plateforme de gestion et de sécurisation foncière, facilitant l'accès à la propriété en Afrique de l'Ouest.",
    tags: ["Proptech", "GovTech", "Sécurité"],
    status: "live",
    link: "https://foncierfacileafrique.fr/",
    emoji: "📜",
    tech: ["Next.js", "Tailwind CSS", "Supabase"],
    gradient: "linear-gradient(135deg, #0D1117 0%, #071A2F 100%)"
  },
  {
    id: "afribayit",
    title: "AfriBayit",
    category: "Applications SaaS",
    description: "Solution immobilière innovante adaptée aux réalités du marché africain pour la gestion locative et les transactions.",
    tags: ["Proptech", "Immobilier", "Afrique"],
    status: "live",
    link: "https://afribayit.vercel.app/",
    emoji: "🏠",
    tech: ["React", "Node.js", "MongoDB"],
    gradient: "linear-gradient(135deg, #2C1A2C 0%, #080A0F 100%)"
  },
  {
    id: "groupe-serma",
    title: "Groupe SERMA",
    category: "Sites Web",
    description: "Site institutionnel pour un groupe leader dans les services et l'ingénierie en Afrique.",
    tags: ["Corporate", "Ingénierie", "Vitrine"],
    status: "live",
    link: "https://groupe-serma.vercel.app/",
    emoji: "🏗️",
    tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
    gradient: "linear-gradient(135deg, #1A2744 0%, #0D1117 100%)"
  },
  {
    id: "keter-marketing",
    title: "Keter Marketing",
    category: "Sites Web",
    description: "Agence de marketing digital axée sur la performance et la croissance des marques internationales.",
    tags: ["Marketing", "Agence", "Performance"],
    status: "live",
    link: "https://keter-marketing-itan.vercel.app/",
    emoji: "👑",
    tech: ["Next.js", "Animation", "Modern UI"],
    gradient: "linear-gradient(135deg, #071A2F 0%, #141921 100%)"
  }
];
