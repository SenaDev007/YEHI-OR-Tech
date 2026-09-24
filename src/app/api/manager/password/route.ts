import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "Nouveau mot de passe : 8 caractères minimum"),
});

/**
 * PATCH /api/manager/password
 * Change le mot de passe de l'utilisateur courant.
 */
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    // Récupère l'utilisateur avec son hash actuel
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Vérifie l'ancien mot de passe
    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Mot de passe actuel incorrect." },
        { status: 400 }
      );
    }

    // Vérifie que le nouveau n'est pas l'ancien
    const samePassword = await verifyPassword(newPassword, user.passwordHash);
    if (samePassword) {
      return NextResponse.json(
        { ok: false, error: "Le nouveau mot de passe doit être différent de l'ancien." },
        { status: 400 }
      );
    }

    // Hash et update
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    await prisma.auditEvent.create({
      data: {
        action: "password.change",
        entity: "User",
        entityId: user.id,
        details: "Mot de passe changé",
        userId: user.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[password] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
