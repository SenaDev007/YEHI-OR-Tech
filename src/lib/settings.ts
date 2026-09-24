/**
 * Paramètres publics du site — types et valeurs par défaut uniquement.
 * Aucun import de module serveur (pg, prisma) → safe pour le bundle client.
 */

export type SiteSettings = {
  whatsappNumber: string;
  contactEmail: string;
  phoneNumber: string;
  hours: string;
  address: string;
  socialLinkedin: string;
  socialFacebook: string;
  socialWhatsapp: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "2290141360803",
  contactEmail: "contact@yehiortech.com",
  phoneNumber: "+229 01 41 36 08 03",
  hours: "Lundi à samedi, 8h à 20h (GMT+1)",
  address: "Parakou, Bénin — Afrique de l'Ouest",
  socialLinkedin: "https://www.linkedin.com/company/yehi-or-tech",
  socialFacebook: "https://www.facebook.com/yehiortech",
  socialWhatsapp: "https://wa.me/2290141360803",
};
