import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const saleSchema = z.object({
  customerId: z.string().optional().nullable(),
  profitCenter: z.enum(["BOUTIQUE", "DESIGN", "TEXTILE", "ACADEMIA", "DEV"]),
  paymentMethod: z.enum(["ESPECES", "MOBILE_MONEY", "VIREMENT", "AUTRE"]),
  paymentReference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  lines: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
    })
  ).min(1, "Au moins une ligne"),
});

/**
 * GET /api/manager/sales
 * Liste paginée des ventes.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
  const offset = Number(url.searchParams.get("offset") || 0);
  const profitCenter = url.searchParams.get("profitCenter");
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");

  const where: Record<string, unknown> = { organizationId: session.organizationId };
  if (profitCenter) where.profitCenter = profitCenter;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
  }

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      include: {
        customer: true,
        user: { select: { id: true, name: true } },
        lines: { include: { product: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.sale.count({ where }),
  ]);

  return NextResponse.json({
    ok: true,
    data: sales,
    total,
    limit,
    offset,
  });
}

/**
 * POST /api/manager/sales
 * Crée une nouvelle vente avec ses lignes et paiement.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = saleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { lines, paymentMethod, paymentReference, ...rest } = parsed.data;

    // Calcul du total
    const totalAmount = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

    // Numéro visible : V-2026-XXX
    const year = new Date().getFullYear();
    const count = await prisma.sale.count({
      where: { organizationId: session.organizationId },
    });
    const number = `V-${year}-${String(count + 1).padStart(4, "0")}`;

    // Récupère la session de caisse ouverte (si disponible)
    const openCash = await prisma.cashSession.findFirst({
      where: {
        organizationId: session.organizationId,
        userId: session.sub,
        status: "OUVERTE",
      },
    });

    const sale = await prisma.sale.create({
      data: {
        number,
        organizationId: session.organizationId,
        userId: session.sub,
        cashSessionId: openCash?.id,
        totalAmount,
        paidAmount: totalAmount, // V1 : paiement complet
        status: "PAYEE",
        ...rest,
        lines: {
          create: lines.map((l) => ({
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            totalAmount: l.quantity * l.unitPrice,
            productId: l.productId,
          })),
        },
        payments: {
          create: {
            method: paymentMethod,
            amount: totalAmount,
            reference: paymentReference || null,
          },
        },
      },
      include: {
        lines: { include: { product: true } },
        payments: true,
      },
    });

    // Audit
    await prisma.auditEvent.create({
      data: {
        action: "sale.create",
        entity: "Sale",
        entityId: sale.id,
        details: `Vente ${sale.number} créée (${totalAmount} FCFA)`,
        userId: session.sub,
      },
    });

    return NextResponse.json({ ok: true, data: sale }, { status: 201 });
  } catch (err) {
    console.error("[sales/create] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur lors de la création de la vente" },
      { status: 500 }
    );
  }
}
