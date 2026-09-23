/**
 * 4 métriques animées au scroll sur la homepage.
 * Toutes vérifiables aujourd'hui — aucune promesse gonflée.
 */

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
  meaning: string;
};

export const stats: Stat[] = [
  {
    value: 8,
    label: "Services numériques couverts",
    meaning:
      "Tu n'as pas besoin d'un prestataire différent pour chaque brique de ton projet.",
  },
  {
    value: 6,
    label: "Marques dans l'écosystème YEHI OR",
    meaning:
      "Ce n'est pas une agence qui revend des templates, c'est une entreprise qui construit ses propres produits.",
  },
  {
    value: 48,
    suffix: "h",
    label: "Délai de réponse garanti",
    meaning: "Ton message n'attend pas trois semaines dans une boîte mail.",
  },
  {
    value: 3,
    label: "Métiers exercés avant le code",
    meaning:
      "Enseignement, sécurité industrielle, biotechnologie : la rigueur du terrain, appliquée au numérique.",
  },
];

export const whyChooseUsMetrics: Stat[] = [
  { value: 48, suffix: "h", label: "Délai de réponse garanti", meaning: "" },
  { value: 100, suffix: "%", label: "Projets pensés IA d'abord", meaning: "" },
  { value: 0, label: "Mobile First", meaning: "" },
  { value: 0, label: "Bénin → Afrique", meaning: "" },
];

export const iaUseCases: { iconName: string; label: string; description: string }[] = [
  {
    iconName: "Bot",
    label: "Agent IA WhatsApp 24h/24",
    description:
      "Répond à tes clients, qualifie les demandes et prend des rendez-vous même pendant que tu dors.",
  },
  {
    iconName: "MessageCircle",
    label: "Assistant client intégré à ton site",
    description:
      "Un agent conversationnel sur ton site web qui oriente les visiteurs et capture les contacts qualifiés.",
  },
  {
    iconName: "Mail",
    label: "Relances commerciales automatisées",
    description:
      "Plus aucun prospect oublié en route. Les relances partent au bon moment, sans intervention manuelle.",
  },
  {
    iconName: "Share2",
    label: "Publication planifiée sur les réseaux",
    description:
      "Ton calendrier de contenu se remplit tout seul, sur les bons canaux, aux bons horaires.",
  },
  {
    iconName: "Target",
    label: "Qualification automatique des prospects",
    description:
      "Chaque demande entrante est triée, étiquetée et priorisée avant qu'un humain ne prenne le relais.",
  },
  {
    iconName: "CalendarClock",
    label: "Prise de rendez-vous sans intervention",
    description:
      "Tes prospects réservent un créneau directement dans ton agenda, sans échange d'emails ni aller-retour.",
  },
];
