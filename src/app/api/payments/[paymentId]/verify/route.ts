import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * POST /api/payments/[paymentId]/verify
 * Vérifie le statut réel d'un paiement FedaPay côté serveur.
 * Le frontend ne doit JAMAIS faire confiance au callback onComplete.
 *
 * Pattern suivi : Academia Helm.
 */
export async function POST(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const { paymentId } = params;
  if (!paymentId) {
    return NextResponse.json({ ok: false, error: "paymentId requis" }, { status: 400 });
  }

  const secretKey = process.env.FEDAPAY_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { ok: false, error: "FedaPay non configuré" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://api.fedapay.com/v1/transactions/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: "Erreur lors de la vérification FedaPay" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const status = data?.status || data?.transaction?.status;
    const isPaid = status === "completed" || status === "approved" || status === "paid";

    if (isPaid) {
      await prisma.auditEvent.create({
        data: {
          action: "payment.verified",
          entity: "Payment",
          entityId: paymentId,
          details: `Paiement ${paymentId} vérifié : ${status}`,
          userId: session.sub,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      status,
      isPaid,
      amount: data?.amount || data?.transaction?.amount,
      data,
    });
  } catch (err) {
    console.error("[payments/verify] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
