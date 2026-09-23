import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * GET /api/manager/stats
 * Retourne les KPIs du tableau de bord.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const orgId = session.organizationId;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Recettes du jour
  const todaySales = await prisma.sale.aggregate({
    where: {
      organizationId: orgId,
      createdAt: { gte: startOfDay },
      status: { not: "ANNULEE" },
    },
    _sum: { totalAmount: true },
  });

  // Dépenses du jour
  const todayExpenses = await prisma.expense.aggregate({
    where: {
      organizationId: orgId,
      createdAt: { gte: startOfDay },
    },
    _sum: { amount: true },
  });

  // CA du mois
  const monthSales = await prisma.sale.aggregate({
    where: {
      organizationId: orgId,
      createdAt: { gte: startOfMonth },
      status: { not: "ANNULEE" },
    },
    _sum: { totalAmount: true },
  });

  // Dépenses du mois
  const monthExpenses = await prisma.expense.aggregate({
    where: {
      organizationId: orgId,
      createdAt: { gte: startOfMonth },
    },
    _sum: { amount: true },
  });

  // Session de caisse ouverte
  const openCash = await prisma.cashSession.findFirst({
    where: { organizationId: orgId, status: "OUVERTE" },
    include: { user: { select: { name: true } } },
  });

  // Commandes en cours
  const pendingOrders = await prisma.customerOrder.count({
    where: {
      organizationId: orgId,
      status: { in: ["NOUVELLE", "EN_PRODUCTION"] },
    },
  });

  // Stock sous le seuil
  const lowStockItems = await prisma.stockItem.findMany({
    where: {
      organizationId: orgId,
      quantity: { lte: 0 }, // <= threshold - simplifié pour V1
    },
    take: 10,
  });

  // Abonnements Academia à renouveler (echéance dans 30j)
  const academiaUpcoming = await prisma.academiaSubscription.findMany({
    where: {
      organizationId: orgId,
      status: "ACTIF",
      endsAt: { lte: in30Days, gte: now },
    },
    take: 10,
  });

  // Impayés Academia
  const academiaImpayes = await prisma.academiaSubscription.count({
    where: {
      organizationId: orgId,
      status: "IMPAYE",
    },
  });

  // CA par centre de profit (mois en cours)
  const salesByCenter = await prisma.sale.groupBy({
    by: ["profitCenter"],
    where: {
      organizationId: orgId,
      createdAt: { gte: startOfMonth },
      status: { not: "ANNULEE" },
    },
    _sum: { totalAmount: true },
    _count: true,
  });

  // Dépenses par catégorie (mois en cours)
  const expensesByCategory = await prisma.expense.groupBy({
    by: ["category"],
    where: {
      organizationId: orgId,
      createdAt: { gte: startOfMonth },
    },
    _sum: { amount: true },
    _count: true,
  });

  // Enveloppes (soldes)
  const envelopes = await prisma.treasuryEnvelope.findMany({
    where: { organizationId: orgId },
    orderBy: { balance: "desc" },
  });

  return NextResponse.json({
    ok: true,
    data: {
      today: {
        revenue: todaySales._sum.totalAmount || 0,
        expenses: todayExpenses._sum.amount || 0,
        net: (todaySales._sum.totalAmount || 0) - (todayExpenses._sum.amount || 0),
      },
      month: {
        revenue: monthSales._sum.totalAmount || 0,
        expenses: monthExpenses._sum.amount || 0,
        net: (monthSales._sum.totalAmount || 0) - (monthExpenses._sum.amount || 0),
      },
      openCash: openCash
        ? {
            id: openCash.id,
            openedAt: openCash.openedAt,
            openingAmount: openCash.openingAmount,
            user: openCash.user.name,
          }
        : null,
      pendingOrders,
      lowStockItems,
      academiaUpcoming,
      academiaImpayes,
      salesByCenter,
      expensesByCategory,
      envelopes,
    },
  });
}
