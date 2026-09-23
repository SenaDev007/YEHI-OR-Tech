import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/webhooks/fedapay
 * Reçoit les webhooks FedaPay et met à jour les enregistrements en DB.
 *
 * Pattern suivi : Academia Helm.
 * La vérification de signature doit être configurée avec le FEDAPAY_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-fedapay-signature") || "";
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    const event = body?.event || body?.type;
    const transaction = body?.data || body?.transaction;

    if (!transaction?.id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const status = transaction?.status;
    const isPaid = status === "completed" || status === "approved";

    if (isPaid) {
      // Récupère l'organisation
      const org = await prisma.organization.findFirst();
      if (org) {
        await prisma.auditEvent.create({
          data: {
            action: "payment.webhook",
            entity: "Payment",
            entityId: String(transaction.id),
            details: `Webhook FedaPay reçu : ${event || "payment.completed"} — ${status} — ${transaction.amount || "?"} FCFA`,
          },
        });

        // Optionnel : créer une vente automatiquement quand le paiement est confirmé
        // Pour l'instant, on log seulement — l'équipe valide manuellement dans le CMS
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[webhooks/fedapay] Erreur:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
