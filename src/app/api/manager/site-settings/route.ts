import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const settingsSchema = z.object({
  whatsappNumber: z.string().min(5, "Numéro WhatsApp invalide"),
  contactEmail: z.string().email("Email invalide"),
  phoneNumber: z.string().min(5, "Téléphone invalide"),
  hours: z.string().min(1, "Horaires requis"),
  address: z.string().min(1, "Adresse requise"),
  socialLinkedin: z.string().url("URL LinkedIn invalide").or(z.literal("")),
  socialFacebook: z.string().url("URL Facebook invalide").or(z.literal("")),
  socialWhatsapp: z.string().url("URL WhatsApp invalide").or(z.literal("")),
});

/**
 * GET /api/manager/site-settings
 * Récupère les paramètres du site (admin seulement).
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { organizationId: session.organizationId },
  });

  if (!settings) {
    return NextResponse.json({ ok: false, error: "Paramètres introuvables" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, settings });
}

/**
 * PUT /api/manager/site-settings
 * Met à jour les paramètres du site (numéro WhatsApp, email, etc.)
 */
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  // Seul un ADMIN ou RESPONSABLE peut éditer les paramètres du site
  if (session.role !== "ADMIN" && session.role !== "RESPONSABLE") {
    return NextResponse.json(
      { ok: false, error: "Permissions insuffisantes" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const updated = await prisma.siteSettings.upsert({
      where: { organizationId: session.organizationId },
      update: parsed.data,
      create: {
        organizationId: session.organizationId,
        ...parsed.data,
      },
    });

    await prisma.auditEvent.create({
      data: {
        action: "site_settings.update",
        entity: "SiteSettings",
        entityId: updated.id,
        details: "Paramètres du site mis à jour",
        userId: session.sub,
      },
    });

    return NextResponse.json({ ok: true, settings: updated });
  } catch (err) {
    console.error("[site-settings] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
