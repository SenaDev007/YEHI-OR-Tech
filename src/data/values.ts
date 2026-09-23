/**
 * 8 valeurs de YEHI OR Tech — page À propos.
 */

export type Value = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

export const values: Value[] = [
  {
    number: "01",
    title: "Excellence",
    description:
      "Un livrable fini vaut mieux que trois livrables approximatifs. On ne livre rien qui ne tienne la route sur la durée.",
    icon: "Star",
  },
  {
    number: "02",
    title: "Clarté",
    description:
      "Un prix, un délai, un périmètre. Écrits, pas promis à l'oral. Le flou est la première trahison de la confiance.",
    icon: "Eye",
  },
  {
    number: "03",
    title: "Fiabilité",
    description:
      "Ce qui est annoncé est tenu, ou communiqué à temps si ça change. Le silence radio n'est jamais une option.",
    icon: "ShieldCheck",
  },
  {
    number: "04",
    title: "Créativité",
    description:
      "Une solution qui ressemble à ton activité, pas à un modèle générique. Le copier-coller tue la marque.",
    icon: "Sparkles",
  },
  {
    number: "05",
    title: "Impact",
    description:
      "Un outil qui change une journée de travail vaut plus qu'une fonctionnalité impressionnante et inutilisée.",
    icon: "Zap",
  },
  {
    number: "06",
    title: "Éthique",
    description:
      "Aucune donnée client vendue, aucun chiffre gonflé pour vendre plus vite. La réputation précède le revenu.",
    icon: "Heart",
  },
  {
    number: "07",
    title: "Service",
    description:
      "On reste après la livraison, pas seulement jusqu'à l'encaissement. La fin d'un projet n'est pas la fin de la relation.",
    icon: "Handshake",
  },
  {
    number: "08",
    title: "Rigueur",
    description:
      "Le même standard de contrôle qu'en sécurité industrielle, appliqué au code. Le « à peu près » n'est pas un standard.",
    icon: "Ruler",
  },
];

export const techStack: { name: string; category: string }[] = [
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "UI" },
  { name: "Node.js", category: "Runtime" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Claude API", category: "IA" },
  { name: "n8n", category: "Automation" },
  { name: "FedaPay", category: "Paiement" },
  { name: "Kkiapay", category: "Paiement" },
  { name: "Vercel", category: "Hosting" },
  { name: "Git", category: "Versioning" },
];
