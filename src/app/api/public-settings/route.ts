import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db-pg";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";

/**
 * GET /api/public-settings
 * Endpoint public (sans auth) qui retourne les paramètres publics du site.
 *
 * ⚠️ SUR VERCEL : on SAUTE Prisma (Rust engine ne peut pas joindre Neon
 * depuis le runtime serverless — il attend 5-10s avant d'échouer).
 * On utilise directement pg (pure JS) avec 5s timeout.
 *
 * Si pg échoue → fallback sur DEFAULT_SETTINGS (qui ont les valeurs à jour).
 */
export async function GET() {
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
      return NextResponse.json({
        ok: true,
        settings: {
          whatsappNumber: row.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
          contactEmail: row.contactEmail || DEFAULT_SETTINGS.contactEmail,
          phoneNumber: row.phoneNumber || DEFAULT_SETTINGS.phoneNumber,
          hours: row.hours || DEFAULT_SETTINGS.hours,
          address: row.address || DEFAULT_SETTINGS.address,
          socialLinkedin: row.socialLinkedin || DEFAULT_SETTINGS.socialLinkedin,
          socialFacebook: row.socialFacebook || DEFAULT_SETTINGS.socialFacebook,
          socialWhatsapp: row.socialWhatsapp || DEFAULT_SETTINGS.socialWhatsapp,
        } satisfies SiteSettings,
      }, {
        headers: {
          // Cache navigateur 5min + s-maxage 5min (Vercel CDN)
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      });
    }
  } catch (err) {
    console.warn("[public-settings] DB indisponible:", err instanceof Error ? err.message : "unknown");
  }

  return NextResponse.json({ ok: true, settings: DEFAULT_SETTINGS });
}
