import { NextResponse } from "next/server";

/**
 * Endpoint POST /api/contact
 * Reçoit les données du formulaire de contact et les valide côté serveur.
 * V1 : enregistre dans les logs (peut être étendu vers un service mail / DB).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation minimale serveur (le client valide déjà via zod)
    if (!body?.name || !body?.email || !body?.service || !body?.message) {
      return NextResponse.json(
        { ok: false, error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { ok: false, error: "Email invalide." },
        { status: 400 }
      );
    }

    // V1 : log structuré côté serveur (visible dans les logs Vercel)
    // V2 : envoyer un email via Resend / SendGrid / Postmark
    // V3 : persister en base via Prisma
    console.log("[contact] Nouvelle demande reçue", {
      timestamp: new Date().toISOString(),
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      service: body.service,
      budget: body.budget || null,
      messagePreview: (body.message as string).slice(0, 120) + "…",
    });

    // Réponse succès
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Erreur serveur", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessaie ou contacte-nous sur WhatsApp." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "contact-form-v1" });
}
