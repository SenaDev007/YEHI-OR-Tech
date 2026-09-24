import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const openSchema = z.object({
  openingAmount: z.number().min(0, "Montant d'ouverture invalide"),
});

const closeSchema = z.object({
  closingAmount: z.number().min(0),
  differenceNote: z.string().optional().nullable(),
});

/**
 * GET /api/manager/cash
 * Récupère les sessions de caisse (courante + historique récent).
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  const where: Record<string, unknown> = { organizationId: session.organizationId };
  if (status) where.status = status;

  const cashSessions = await prisma.cashSession.findMany({
    where,
    include: {
      user: { select: { id: true, name: true } },
      sales: {
        select: { id: true, totalAmount: true, number: true },
      },
    },
    orderBy: { openedAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ ok: true, data: cashSessions });
}

/**
 * POST /api/manager/cash
 * Ouvre ou ferme une session de caisse.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Ouverture
    if ("openingAmount" in body) {
      const parsed = openSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ ok: false, error: "Montant invalide" }, { status: 400 });
      }

      // Vérifier qu'aucune session ouverte pour cet utilisateur
      const existing = await prisma.cashSession.findFirst({
        where: {
          organizationId: session.organizationId,
          userId: session.sub,
          status: "OUVERTE",
        },
      });
      if (existing) {
        return NextResponse.json(
          { ok: false, error: "Une session de caisse est déjà ouverte pour toi." },
          { status: 400 }
        );
      }

      const cash = await prisma.cashSession.create({
        data: {
          organizationId: session.organizationId,
          userId: session.sub,
          openingAmount: parsed.data.openingAmount,
          status: "OUVERTE",
        },
      });

      await prisma.auditEvent.create({
        data: {
          action: "cash.open",
          entity: "CashSession",
          entityId: cash.id,
          details: `Ouverture caisse avec ${parsed.data.openingAmount} FCFA`,
          userId: session.sub,
        },
      });

      return NextResponse.json({ ok: true, data: cash }, { status: 201 });
    }

    // Clôture
    if ("closingAmount" in body && "sessionId" in body) {
      const parsed = closeSchema.safeParse({
        closingAmount: body.closingAmount,
        differenceNote: body.differenceNote,
      });
      if (!parsed.success) {
        return NextResponse.json({ ok: false, error: "Données invalides" }, { status: 400 });
      }

      const cash = await prisma.cashSession.findUnique({
        where: { id: body.sessionId },
        include: { sales: true },
      });

      if (!cash || cash.status !== "OUVERTE") {
        return NextResponse.json(
          { ok: false, error: "Session introuvable ou déjà clôturée" },
          { status: 404 }
        );
      }

      // Calcul du montant théorique : ouverture + ventes espèces
      const cashSalesTotal = cash.sales.reduce(
        (sum, s) => sum + s.totalAmount,
        0
      );
      // Pour la V1, on suppose toutes les ventes en espèces
      const theoretical = cash.openingAmount + cashSalesTotal;
      const difference = parsed.data.closingAmount - theoretical;

      const updated = await prisma.cashSession.update({
        where: { id: cash.id },
        data: {
          closedAt: new Date(),
          closingAmount: parsed.data.closingAmount,
          theoreticalAmount: theoretical,
          difference,
          differenceNote: parsed.data.differenceNote || null,
          status: Math.abs(difference) > 1 ? "ECART_NON_RESOLU" : "CLOTUREE",
        },
      });

      await prisma.auditEvent.create({
        data: {
          action: "cash.close",
          entity: "CashSession",
          entityId: cash.id,
          details: `Clôture caisse — Théorique: ${theoretical} FCFA, Réel: ${parsed.data.closingAmount} FCFA, Écart: ${difference} FCFA`,
          userId: session.sub,
        },
      });

      return NextResponse.json({ ok: true, data: updated });
    }

    return NextResponse.json(
      { ok: false, error: "Action non reconnue (ouverture ou clôture)" },
      { status: 400 }
    );
  } catch (err) {
    console.error("[cash] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
