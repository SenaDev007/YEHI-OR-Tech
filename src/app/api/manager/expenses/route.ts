import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const expenseSchema = z.object({
  category: z.string().min(1, "Catégorie requise"),
  amount: z.number().positive("Montant doit être positif"),
  vendor: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  profitCenter: z.enum(["BOUTIQUE", "DESIGN", "TEXTILE", "ACADEMIA", "DEV"]).optional().nullable(),
  envelopeId: z.string().optional().nullable(),
});

/**
 * GET /api/manager/expenses
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
  const offset = Number(url.searchParams.get("offset") || 0);

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where: { organizationId: session.organizationId },
      include: {
        user: { select: { id: true, name: true } },
        envelope: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.expense.count({
      where: { organizationId: session.organizationId },
    }),
  ]);

  return NextResponse.json({ ok: true, data: expenses, total, limit, offset });
}

/**
 * POST /api/manager/expenses
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = expenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const count = await prisma.expense.count({
      where: { organizationId: session.organizationId },
    });
    const number = `D-${year}-${String(count + 1).padStart(4, "0")}`;

    const expense = await prisma.expense.create({
      data: {
        number,
        organizationId: session.organizationId,
        userId: session.sub,
        category: parsed.data.category,
        amount: parsed.data.amount,
        vendor: parsed.data.vendor || null,
        description: parsed.data.description || null,
        profitCenter: parsed.data.profitCenter || null,
        envelopeId: parsed.data.envelopeId || null,
      },
    });

    // Audit
    await prisma.auditEvent.create({
      data: {
        action: "expense.create",
        entity: "Expense",
        entityId: expense.id,
        details: `Dépense ${expense.number} créée (${parsed.data.amount} FCFA — ${parsed.data.category})`,
        userId: session.sub,
      },
    });

    return NextResponse.json({ ok: true, data: expense }, { status: 201 });
  } catch (err) {
    console.error("[expenses/create] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur lors de la création de la dépense" },
      { status: 500 }
    );
  }
}
