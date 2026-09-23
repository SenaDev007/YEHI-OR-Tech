/**
 * Informations globales du site YEHI OR Tech.
 * Source : CDC v4.0, sections 1.1 et 1.2.
 * Toute donnée textuelle doit vivre ici — jamais hardcodée dans un composant.
 */

export const siteConfig = {
  name: "YEHI OR Tech",
  slogan: "Des idées lumineuses, des solutions encore plus brillantes.",
  founder: "Dawes S. Akpowi Tohou",
  domain: "yehiortech.com",
  url: "https://yehiortech.com",
  email: "contact@yehiortech.com",
  phone: "+229 01 41 36 08 03",
  whatsappNumber: "2290141360803",
  city: "Parakou",
  country: "Bénin",
  region: "Afrique de l'Ouest",
  hours: "Lundi à samedi, 8h à 20h (GMT+1)",
  nameMeaning:
    "YEHI OR = « Que la lumière soit » en hébreu. Lumière, clarté, transformation, excellence et impact.",
  tagline: "Agence digitale augmentée par l'IA · Parakou, Bénin",
  description:
    "Sites web, applications, agents IA, automatisation et crédibilité en ligne. Huit métiers, un seul interlocuteur, un devis clair avant de commencer.",
  social: {
    linkedin: "https://www.linkedin.com/company/yehi-or-tech",
    facebook: "https://www.facebook.com/yehiortech",
    whatsapp: "https://wa.me/2290141360803",
  },
  nav: [
    { label: "Accueil", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Tarifs", href: "/tarifs" },
    { label: "Réalisations", href: "/portfolio" },
    { label: "À propos", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
