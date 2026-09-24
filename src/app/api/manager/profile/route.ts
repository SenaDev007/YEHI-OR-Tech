import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
});

/**
 * PATCH /api/manager/profile
 * Met à jour le profil courant (nom et email).
 */
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;

    // Vérifier que l'email n'est pas déjà pris par un autre
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing && existing.id !== session.sub) {
      return NextResponse.json(
        { ok: false, error: "Cet email est déjà utilisé." },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.sub },
      data: {
        name,
        email: email.toLowerCase(),
      },
      select: { id: true, name: true, email: true, role: true },
    });

    await prisma.auditEvent.create({
      data: {
        action: "profile.update",
        entity: "User",
        entityId: updated.id,
        details: `Profil mis à jour : ${updated.name} (${updated.email})`,
        userId: updated.id,
      },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[profile] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
