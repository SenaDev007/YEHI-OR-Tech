import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings-server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/public-settings
 * Endpoint public (sans auth) qui retourne les paramètres publics du site.
 * Utilisé par les composants client (Navbar, Footer, WhatsAppButton, etc.)
 * via le SettingsProvider.
 */
export async function GET() {
  // En dev local sans DB configurée, fallback sur les valeurs par défaut
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings) {
      return NextResponse.json({
        ok: true,
        settings: {
          whatsappNumber: settings.whatsappNumber,
          contactEmail: settings.contactEmail,
          phoneNumber: settings.phoneNumber,
          hours: settings.hours,
          address: settings.address,
          socialLinkedin: settings.socialLinkedin,
          socialFacebook: settings.socialFacebook,
          socialWhatsapp: settings.socialWhatsapp,
        },
      });
    }
  } catch (err) {
    console.warn("[public-settings] DB indisponible:", err);
  }

  const fallback = await getSettings();
  return NextResponse.json({ ok: true, settings: fallback });
}
