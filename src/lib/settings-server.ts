import { prisma } from "./prisma";
import { queryOne } from "./db-pg";
import { DEFAULT_SETTINGS, type SiteSettings } from "./settings";

/**
 * Récupère les paramètres du site depuis la DB (côté serveur uniquement).
 * Fallback sur DEFAULT_SETTINGS si la DB est indisponible.
 * Utilise Prisma en priorité, pg (pure JS) en fallback.
 *
 * ⚠️ Ce fichier ne doit JAMAIS être importé par un composant client.
 * Utilisé uniquement par les Server Components et les API routes.
 */
export async function getSettings(): Promise<SiteSettings> {
  // Tente Prisma d'abord
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings) {
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
    }
    return DEFAULT_SETTINGS;
  } catch (prismaErr) {
    console.warn("[settings] Prisma failed, trying pg fallback:", prismaErr instanceof Error ? prismaErr.message : "unknown");
    // Fallback: pg (pure JS)
    try {
      const row = await queryOne<{
        whatsappnumber: string;
        contactemail: string;
        phonenumber: string;
        hours: string;
        address: string;
        sociallinkedin: string;
        socialfacebook: string;
        socialwhatsapp: string;
      }>('SELECT "whatsappNumber", "contactEmail", "phoneNumber", hours, address, "socialLinkedin", "socialFacebook", "socialWhatsapp" FROM "SiteSettings" LIMIT 1');
      if (row) {
        return {
          whatsappNumber: row.whatsappnumber,
          contactEmail: row.contactemail,
          phoneNumber: row.phonenumber,
          hours: row.hours,
          address: row.address,
          socialLinkedin: row.sociallinkedin,
          socialFacebook: row.socialfacebook,
          socialWhatsapp: row.socialwhatsapp,
        };
      }
    } catch (pgErr) {
      console.warn("[settings] pg fallback also failed:", pgErr instanceof Error ? pgErr.message : "unknown");
    }
    return DEFAULT_SETTINGS;
  }
}
