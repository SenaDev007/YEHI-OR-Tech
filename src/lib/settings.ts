import { prisma } from "./prisma";

/**
 * Paramètres publics du site (lus depuis la base de données).
 * Tous ces champs sont éditables depuis /manager/settings.
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

/**
 * Valeurs par défaut (fallback si DB indisponible).
 */
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

/**
 * Récupère les paramètres du site depuis la DB (côté serveur uniquement).
 * Fallback sur DEFAULT_SETTINGS si la DB est indisponible.
 *
 * Organisation par défaut : "yehi-or-tech" (singleton).
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { organizationId: "yehi-or-tech" },
    });
    if (!settings) return DEFAULT_SETTINGS;
    return {
      whatsappNumber: settings.whatsappNumber,
      contactEmail: settings.contactEmail,
      phoneNumber: settings.phoneNumber,
      hours: settings.hours,
      address: settings.address,
      socialLinkedin: settings.socialLinkedin,
      socialFacebook: settings.socialFacebook,
      socialWhatsapp: settings.socialWhatsapp,
    };
  } catch (err) {
    console.warn("[settings] Erreur lecture DB, utilisation défaut:", err);
    return DEFAULT_SETTINGS;
  }
}
