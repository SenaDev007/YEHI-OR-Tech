import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const paymentSchema = z.object({
  amount: z.number().positive("Montant doit être positif"),
  description: z.string().min(5, "Description trop courte"),
  customerEmail: z.string().email("Email invalide"),
  customerName: z.string().min(2, "Nom requis"),
  customerPhone: z.string().optional(),
  leadId: z.string().optional(),
});

/**
 * POST /api/payments/create
 * Crée une transaction FedaPay côté serveur (avec la clé secrète).
 * Retourne la clé publique + les infos de transaction pour le checkout intégré.
 *
 * Pattern suivi : Academia Helm (FedaPayCheckout.tsx + API proxy).
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { amount, description, customerEmail, customerName, customerPhone, leadId } = parsed.data;
    const secretKey = process.env.FEDAPAY_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "FedaPay n'est pas configuré (FEDAPAY_SECRET_KEY manquant)" },
        { status: 500 }
      );
    }

    // Crée la transaction via l'API FedaPay REST
    const fedapayResponse = await fetch("https://api.fedapay.com/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        transaction: {
          amount,
          description,
          currency: { iso: "XOF" },
        },
        customer: {
          email: customerEmail,
          firstname: customerName,
          ...(customerPhone && { phone_number: customerPhone }),
        },
      }),
    });

    if (!fedapayResponse.ok) {
      const errData = await fedapayResponse.json().catch(() => ({}));
      console.error("[payments/create] FedaPay error:", errData);
      return NextResponse.json(
        { ok: false, error: "Erreur lors de la création de la transaction FedaPay" },
        { status: 500 }
      );
    }

    const fedapayData = await fedapayResponse.json();
    const transactionId = fedapayData?.id || fedapayData?.transaction?.id;

    // Audit log
    await prisma.auditEvent.create({
      data: {
        action: "payment.create",
        entity: "Payment",
        entityId: String(transactionId || ""),
        details: `Transaction FedaPay créée : ${amount} FCFA pour ${customerName} (${customerEmail})`,
        userId: session.sub,
      },
    });

    // Si un lead est associé, met à jour le CustomerOrder avec le prix
    if (leadId) {
      await prisma.customerOrder.update({
        where: { id: leadId },
        data: {
          price: amount,
          status: "EN_PRODUCTION",
        },
      });
    }

    return NextResponse.json({
      ok: true,
      publicKey: process.env.FEDAPAY_PUBLIC_KEY,
      transaction: {
        id: transactionId,
        amount,
        description,
      },
      customer: {
        email: customerEmail,
        lastname: customerName,
        ...(customerPhone && { phone_number: customerPhone }),
      },
    });
  } catch (err) {
    console.error("[payments/create] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
