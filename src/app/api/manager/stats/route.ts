import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { queryWithFallback } from "@/lib/db-pg";

/**
 * GET /api/manager/stats
 * KPIs du tableau de bord.
 *
 * SUR VERCEL : on utilise pg (pure JS) en parallèle (Promise.all)
 * au lieu de Prisma séquentiel — Prisma ne peut pas joindre Neon
 * depuis le runtime serverless de Vercel. On saute donc Prisma.
 *
 * SUR RAILWAY : le backend Railway fait pareil mais avec Prisma + cache 30s.
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

  try {
    // Lancer toutes les requêtes EN PARALLÈLE (était séquentiel avant)
    // — passe de ~30s à ~3-5s même avec une seule connexion pg
    const [
      todaySalesRes,
      todayExpensesRes,
      monthSalesRes,
      monthExpensesRes,
      openCashRes,
      pendingOrdersRes,
      lowStockRes,
      academiaImpayesRes,
      academiaUpcomingRes,
      salesByCenterRes,
      expensesByCategoryRes,
      envelopesRes,
      recentLeadsRes,
    ] = await Promise.all([
      queryWithFallback(
        'SELECT COALESCE(SUM("totalAmount"), 0) as total FROM "Sale" WHERE "organizationId" = $1 AND "createdAt" >= $2 AND status != $3',
        [orgId, startOfDay, "ANNULEE"]
      ),
      queryWithFallback(
        'SELECT COALESCE(SUM(amount), 0) as total FROM "Expense" WHERE "organizationId" = $1 AND "createdAt" >= $2',
        [orgId, startOfDay]
      ),
      queryWithFallback(
        'SELECT COALESCE(SUM("totalAmount"), 0) as total FROM "Sale" WHERE "organizationId" = $1 AND "createdAt" >= $2 AND status != $3',
        [orgId, startOfMonth, "ANNULEE"]
      ),
      queryWithFallback(
        'SELECT COALESCE(SUM(amount), 0) as total FROM "Expense" WHERE "organizationId" = $1 AND "createdAt" >= $2',
        [orgId, startOfMonth]
      ),
      queryWithFallback(
        `SELECT cs.id, cs."openedAt", cs."openingAmount", u.name as "userName"
         FROM "CashSession" cs
         LEFT JOIN "User" u ON u.id = cs."userId"
         WHERE cs."organizationId" = $1 AND cs.status = 'OUVERTE'
         LIMIT 1`,
        [orgId]
      ),
      queryWithFallback(
        `SELECT COUNT(*)::int as count FROM "CustomerOrder"
         WHERE "organizationId" = $1 AND status IN ('NOUVELLE', 'EN_PRODUCTION')`,
        [orgId]
      ),
      queryWithFallback(
        'SELECT id, name, category, unit, quantity, threshold FROM "StockItem" WHERE "organizationId" = $1 AND quantity <= 0 LIMIT 10',
        [orgId]
      ),
      queryWithFallback(
        `SELECT COUNT(*)::int as count FROM "AcademiaSubscription"
         WHERE "organizationId" = $1 AND status = 'IMPAYE'`,
        [orgId]
      ),
      queryWithFallback(
        `SELECT id, "schoolName", "endsAt" FROM "AcademiaSubscription"
         WHERE "organizationId" = $1 AND status = 'ACTIF' AND "endsAt" <= $2 AND "endsAt" >= $3 LIMIT 10`,
        [orgId, in30Days, now]
      ),
      queryWithFallback(
        `SELECT "profitCenter", SUM("totalAmount") as total, COUNT(*)::int as count
         FROM "Sale" WHERE "organizationId" = $1 AND "createdAt" >= $2 AND status != $3
         GROUP BY "profitCenter"`,
        [orgId, startOfMonth, "ANNULEE"]
      ),
      queryWithFallback(
        `SELECT category, SUM(amount) as total, COUNT(*)::int as count
         FROM "Expense" WHERE "organizationId" = $1 AND "createdAt" >= $2
         GROUP BY category`,
        [orgId, startOfMonth]
      ),
      queryWithFallback(
        'SELECT id, name, balance, "isOperational" FROM "TreasuryEnvelope" WHERE "organizationId" = $1 ORDER BY balance DESC',
        [orgId]
      ),
      queryWithFallback(
        `SELECT o.id, o.number, o.title, o.status, o."createdAt", o.description, o.price,
                c.name as "customerName", c.email as "customerEmail", c.phone as "customerPhone"
         FROM "CustomerOrder" o
         LEFT JOIN "Customer" c ON c.id = o."customerId"
         WHERE o."organizationId" = $1 AND o.status = 'NOUVELLE'
         ORDER BY o."createdAt" DESC LIMIT 5`,
        [orgId]
      ),
    ]);

    // Extraire les valeurs
    const todaySales = Number(todaySalesRes.rows[0]?.total || 0);
    const todayExpenses = Number(todayExpensesRes.rows[0]?.total || 0);
    const monthSales = Number(monthSalesRes.rows[0]?.total || 0);
    const monthExpenses = Number(monthExpensesRes.rows[0]?.total || 0);
    const openCashRow = openCashRes.rows[0] as
      | { id: string; openedAt: Date; openingAmount: number; userName: string | null }
      | undefined;
    const pendingOrders = Number(pendingOrdersRes.rows[0]?.count || 0);
    const lowStock = lowStockRes.rows;
    const academiaImpayes = Number(academiaImpayesRes.rows[0]?.count || 0);
    const academiaUpcoming = academiaUpcomingRes.rows;
    const salesByCenter = salesByCenterRes.rows.map((r: { profitCenter: string; total: string; count: number }) => ({
      profitCenter: r.profitCenter,
      _sum: { totalAmount: Number(r.total) },
      _count: Number(r.count),
    }));
    const expensesByCategory = expensesByCategoryRes.rows.map((r: { category: string; total: string; count: number }) => ({
      category: r.category,
      _sum: { amount: Number(r.total) },
      _count: Number(r.count),
    }));
    const envelopes = envelopesRes.rows.map((r: { id: string; name: string; balance: number; isOperational: boolean }) => ({
      id: r.id,
      name: r.name,
      balance: Number(r.balance),
      isOperational: r.isOperational,
    }));
    const recentLeads = recentLeadsRes.rows.map((r: {
      id: string; number: string; title: string; status: string; createdAt: Date;
      description: string | null; price: number | null;
      customerName: string | null; customerEmail: string | null; customerPhone: string | null;
    }) => ({
      id: r.id,
      number: r.number,
      title: r.title,
      status: r.status,
      createdAt: r.createdAt,
      customerName: r.customerName || "—",
      customerEmail: r.customerEmail || "—",
      customerPhone: r.customerPhone || "—",
      description: r.description,
      price: r.price ? Number(r.price) : 0,
    }));

    return NextResponse.json({
      ok: true,
      data: {
        today: {
          revenue: todaySales,
          expenses: todayExpenses,
          net: todaySales - todayExpenses,
        },
        month: {
          revenue: monthSales,
          expenses: monthExpenses,
          net: monthSales - monthExpenses,
        },
        openCash: openCashRow
          ? {
              id: openCashRow.id,
              openedAt: openCashRow.openedAt,
              openingAmount: Number(openCashRow.openingAmount),
              user: openCashRow.userName || "—",
            }
          : null,
        pendingOrders,
        recentLeads,
        lowStockItems: lowStock,
        academiaUpcoming,
        academiaImpayes,
        salesByCenter,
        expensesByCategory,
        envelopes,
      },
    });
  } catch (err) {
    console.error("[api/manager/stats] Erreur:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? `Erreur base de données: ${err.message}`
            : "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
