/**
 * Récupère les paramètres du site côté serveur (Server Components).
 *
 * ⚠️ SUR VERCEL : on SAUTE Prisma (Rust engine ne marche pas en serverless).
 * On utilise pg direct avec 5s timeout.
 *
 * Fallback : DEFAULT_SETTINGS (qui ont les valeurs à jour).
 */
import { queryOne } from "./db-pg";
import { DEFAULT_SETTINGS, type SiteSettings } from "./settings";

export async function getSettings(): Promise<SiteSettings> {
  try {
    const row = await queryOne<{
      whatsappNumber: string;
      contactEmail: string;
      phoneNumber: string;
      hours: string;
      address: string;
      socialLinkedin: string;
      socialFacebook: string;
      socialWhatsapp: string;
    }>(
      'SELECT "whatsappNumber", "contactEmail", "phoneNumber", hours, address, "socialLinkedin", "socialFacebook", "socialWhatsapp" FROM "SiteSettings" LIMIT 1'
    );

    if (row) {
      return {
        whatsappNumber: row.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
        contactEmail: row.contactEmail || DEFAULT_SETTINGS.contactEmail,
        phoneNumber: row.phoneNumber || DEFAULT_SETTINGS.phoneNumber,
        hours: row.hours || DEFAULT_SETTINGS.hours,
        address: row.address || DEFAULT_SETTINGS.address,
        socialLinkedin: row.socialLinkedin || DEFAULT_SETTINGS.socialLinkedin,
        socialFacebook: row.socialFacebook || DEFAULT_SETTINGS.socialFacebook,
        socialWhatsapp: row.socialWhatsapp || DEFAULT_SETTINGS.socialWhatsapp,
      };
    }
  } catch (err) {
    console.warn("[settings] pg failed:", err instanceof Error ? err.message : "unknown");
  }
  return DEFAULT_SETTINGS;
}
