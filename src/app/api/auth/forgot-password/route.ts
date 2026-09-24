import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const forgotSchema = z.object({
  email: z.string().email("Email invalide"),
});

/**
 * POST /api/auth/forgot-password
 * Génère un token de réinitialisation et envoie un email avec le lien.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Email invalide" }, { status: 400 });
    }

    const { email } = parsed.data;

    // Vérifie si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.active) {
      // Ne pas révéler si l'email existe ou non (sécurité)
      return NextResponse.json({ ok: true, message: "Si ce compte existe, un email de réinitialisation a été envoyé." });
    }

    // Génère un token sécurisé
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Invalide les anciens tokens pour cet email
    await prisma.passwordReset.updateMany({
      where: { email: email.toLowerCase(), used: false },
      data: { used: true },
    });

    // Crée le nouveau token
    await prisma.passwordReset.create({
      data: { email: email.toLowerCase(), token, expiresAt },
    });

    // URL de réinitialisation
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yehiortech.com";
    const resetUrl = `${baseUrl}/manager/reset-password?token=${token}`;

    // Envoi email via Resend (si configuré)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || "noreply@yehiortech.com",
          to: email,
          subject: "YEHI OR Manager — Réinitialisation de ton mot de passe",
          html: `
            <h2>Réinitialisation de mot de passe</h2>
            <p>Bonjour ${user.name},</p>
            <p>Tu as demandé à réinitialiser ton mot de passe pour ton compte YEHI OR Manager.</p>
            <p>Clique sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
            <p><a href="${resetUrl}" style="display:inline-block;background:#F5B700;color:#080A0F;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:bold;">Réinitialiser mon mot de passe</a></p>
            <p>Ou copie ce lien : ${resetUrl}</p>
            <p><strong>Ce lien expire dans 1 heure.</strong></p>
            <p>Si tu n'as pas demandé cette réinitialisation, ignore cet email.</p>
            <hr>
            <p><small>YEHI OR Tech — Que la lumière soit ✦</small></p>
          `,
        });
      } catch (emailErr) {
        console.warn("[forgot-password] Email envoi échoué:", emailErr);
      }
    }

    return NextResponse.json({ ok: true, message: "Si ce compte existe, un email de réinitialisation a été envoyé." });
  } catch (err) {
    console.error("[forgot-password] Erreur:", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
