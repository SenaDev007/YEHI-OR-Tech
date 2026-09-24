import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const resetSchema = z.object({
  token: z.string().min(10, "Token invalide"),
  newPassword: z.string().min(8, "Mot de passe : 8 caractères minimum"),
});

/**
 * POST /api/auth/reset-password
 * Vérifie le token et définit un nouveau mot de passe.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Données invalides" }, { status: 400 });
    }

    const { token, newPassword } = parsed.data;

    // Cherche le token
    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
      return NextResponse.json({ ok: false, error: "Ce lien de réinitialisation est invalide ou a expiré." }, { status: 400 });
    }

    // Trouve l'utilisateur
    const user = await prisma.user.findUnique({ where: { email: reset.email } });
    if (!user) {
      return NextResponse.json({ ok: false, error: "Compte introuvable" }, { status: 404 });
    }

    // Hash et update
    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    // Marque le token comme utilisé
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });

    // Audit
    await prisma.auditEvent.create({
      data: { action: "password.reset", entity: "User", entityId: user.id, details: "Mot de passe réinitialisé via token email" },
    });

    return NextResponse.json({ ok: true, message: "Mot de passe réinitialisé. Tu peux te connecter." });
  } catch (err) {
    console.error("[reset-password] Erreur:", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
