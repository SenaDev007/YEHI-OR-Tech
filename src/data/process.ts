/**
 * 6 étapes du processus de travail YEHI OR Tech.
 * Chaque étape répond à une peur implicite du client.
 */

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Analyse du besoin",
    description:
      "On commence par comprendre ton activité et le problème réel à résoudre, avant de proposer quoi que ce soit.",
    icon: "Search",
  },
  {
    number: "02",
    title: "Proposition de solution",
    description:
      "Architecture technique, choix des outils, budget et délai posés noir sur blanc avant le premier jour de travail.",
    icon: "ClipboardList",
  },
  {
    number: "03",
    title: "Design & Architecture",
    description:
      "Maquettes et structure technique validées avec toi avant qu'une seule ligne de code ne soit écrite.",
    icon: "PenTool",
  },
  {
    number: "04",
    title: "Développement",
    description:
      "Construction de la solution, avec un point d'avancement à chaque étape, pas un silence de trois semaines.",
    icon: "Code2",
  },
  {
    number: "05",
    title: "Validation client",
    description:
      "Tests et corrections avec toi avant toute mise en ligne. Zéro surprise le jour de la livraison.",
    icon: "CheckCircle2",
  },
  {
    number: "06",
    title: "Livraison & Suivi",
    description:
      "Déploiement, puis accompagnement après livraison. Ton résultat reste notre indicateur, pas notre facture.",
    icon: "Rocket",
  },
];
