import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "./auth";
import { ROLES } from "../lib/types";

export const managerRouter = Router();

// Toutes les routes manager nécessitent une authentification
managerRouter.use(authMiddleware);

// ============================================================
// GET /api/manager/stats — KPIs du dashboard
// ============================================================
managerRouter.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [todaySales, todayExpenses, monthSales, monthExpenses, openCash, pendingOrders, lowStock, academiaImpayes, academiaUpcoming, salesByCenter, expensesByCategory, envelopes, recentLeads] = await Promise.all([
      prisma.sale.aggregate({ where: { organizationId: orgId, createdAt: { gte: startOfDay }, status: { not: "ANNULEE" } }, _sum: { totalAmount: true } }),
      prisma.expense.aggregate({ where: { organizationId: orgId, createdAt: { gte: startOfDay } }, _sum: { amount: true } }),
      prisma.sale.aggregate({ where: { organizationId: orgId, createdAt: { gte: startOfMonth }, status: { not: "ANNULEE" } }, _sum: { totalAmount: true } }),
      prisma.expense.aggregate({ where: { organizationId: orgId, createdAt: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.cashSession.findFirst({ where: { organizationId: orgId, status: "OUVERTE" }, include: { user: { select: { name: true } } } }),
      prisma.customerOrder.count({ where: { organizationId: orgId, status: { in: ["NOUVELLE", "EN_PRODUCTION"] } } }),
      prisma.stockItem.findMany({ where: { organizationId: orgId, quantity: { lte: 0 } }, take: 10 }),
      prisma.academiaSubscription.count({ where: { organizationId: orgId, status: "IMPAYE" } }),
      prisma.academiaSubscription.findMany({ where: { organizationId: orgId, status: "ACTIF", endsAt: { lte: in30Days, gte: now } }, take: 10 }),
      prisma.sale.groupBy({ by: ["profitCenter"], where: { organizationId: orgId, createdAt: { gte: startOfMonth }, status: { not: "ANNULEE" } }, _sum: { totalAmount: true }, _count: true }),
      prisma.expense.groupBy({ by: ["category"], where: { organizationId: orgId, createdAt: { gte: startOfMonth } }, _sum: { amount: true }, _count: true }),
      prisma.treasuryEnvelope.findMany({ where: { organizationId: orgId }, orderBy: { balance: "desc" } }),
      prisma.customerOrder.findMany({ where: { organizationId: orgId, status: "NOUVELLE" }, include: { customer: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    return res.json({
      ok: true,
      data: {
        today: { revenue: todaySales._sum.totalAmount || 0, expenses: todayExpenses._sum.amount || 0, net: (todaySales._sum.totalAmount || 0) - (todayExpenses._sum.amount || 0) },
        month: { revenue: monthSales._sum.totalAmount || 0, expenses: monthExpenses._sum.amount || 0, net: (monthSales._sum.totalAmount || 0) - (monthExpenses._sum.amount || 0) },
        openCash: openCash ? { id: openCash.id, openedAt: openCash.openedAt, openingAmount: openCash.openingAmount, user: openCash.user.name } : null,
        pendingOrders,
        recentLeads: recentLeads.map((l) => ({ id: l.id, number: l.number, title: l.title, status: l.status, createdAt: l.createdAt, customerName: l.customer?.name || "—", customerEmail: l.customer?.email || "—", customerPhone: l.customer?.phone || "—", description: l.description, price: l.price })),
        lowStockItems: lowStock,
        academiaImpayes,
        academiaUpcoming,
        salesByCenter,
        expensesByCategory,
        envelopes,
      },
    });
  } catch (err) {
    console.error("[manager/stats] Erreur:", err);
    return next(err);
  }
});

// ============================================================
// GET /api/manager/leads — Liste des leads
// ============================================================
managerRouter.get("/leads", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const orders = await prisma.customerOrder.findMany({
      where: { organizationId: orgId },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ ok: true, data: orders.map((o) => ({ id: o.id, number: o.number, title: o.title, description: o.description, status: o.status, price: o.price, createdAt: o.createdAt, customer: o.customer ? { name: o.customer.name, email: o.customer.email, phone: o.customer.phone } : null })) });
  } catch (err) {
    console.error("[manager/leads] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/manager/users — Liste des utilisateurs
// ============================================================
managerRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    if (user.role !== "ADMIN") return res.status(403).json({ ok: false, error: "Accès refusé" });
    const orgId = String(user.organizationId);
    const users = await prisma.user.findMany({
      where: { organizationId: orgId },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ ok: true, data: users });
  } catch (err) {
    console.error("[manager/users] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// POST /api/manager/users — Créer un utilisateur
// ============================================================
const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(ROLES as [string, ...string[]]),
});

managerRouter.post("/users", async (req: Request, res: Response) => {
  try {
    const currentUser = (req as unknown as { user: Record<string, unknown> }).user;
    if (currentUser.role !== "ADMIN") return res.status(403).json({ ok: false, error: "Accès refusé" });
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });

    const { name, email, password, role } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(400).json({ ok: false, error: "Email déjà utilisé" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email: email.toLowerCase(), passwordHash, role, organizationId: String(currentUser.organizationId) },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });

    await prisma.auditEvent.create({ data: { action: "user.create", entity: "User", entityId: newUser.id, details: `Utilisateur créé : ${name} (${email})`, userId: String(currentUser.sub) } }).catch(() => {});
    return res.status(201).json({ ok: true, data: newUser });
  } catch (err) {
    console.error("[manager/users/create] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// PATCH /api/manager/users — Activer/désactiver un utilisateur
// ============================================================
managerRouter.patch("/users", async (req: Request, res: Response) => {
  try {
    const currentUser = (req as unknown as { user: Record<string, unknown> }).user;
    if (currentUser.role !== "ADMIN") return res.status(403).json({ ok: false, error: "Accès refusé" });
    const { userId, active, role } = req.body;
    if (!userId) return res.status(400).json({ ok: false, error: "userId requis" });
    if (userId === currentUser.sub && active === false) return res.status(400).json({ ok: false, error: "Tu ne peux pas désactiver ton propre compte" });

    const data: Record<string, unknown> = {};
    if (typeof active === "boolean") data.active = active;
    if (role) data.role = role;

    const updated = await prisma.user.update({ where: { id: userId }, data, select: { id: true, email: true, name: true, role: true, active: true } });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[manager/users/update] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/manager/site-settings
// ============================================================
managerRouter.get("/site-settings", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const settings = await prisma.siteSettings.findUnique({ where: { organizationId: String(user.organizationId) } });
    if (!settings) return res.status(404).json({ ok: false, error: "Paramètres introuvables" });
    return res.json({ ok: true, settings });
  } catch (err) {
    console.error("[manager/site-settings] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// PUT /api/manager/site-settings
// ============================================================
managerRouter.put("/site-settings", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    if (user.role !== "ADMIN" && user.role !== "RESPONSABLE") return res.status(403).json({ ok: false, error: "Permissions insuffisantes" });
    const updated = await prisma.siteSettings.upsert({
      where: { organizationId: String(user.organizationId) },
      update: req.body,
      create: { organizationId: String(user.organizationId), ...req.body },
    });
    return res.json({ ok: true, settings: updated });
  } catch (err) {
    console.error("[manager/site-settings/update] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// PATCH /api/manager/profile — Mettre à jour son profil
// ============================================================
managerRouter.patch("/profile", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ ok: false, error: "Nom et email requis" });

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing && existing.id !== user.sub) return res.status(400).json({ ok: false, error: "Email déjà utilisé" });

    const updated = await prisma.user.update({
      where: { id: String(user.sub) },
      data: { name, email: email.toLowerCase() },
      select: { id: true, name: true, email: true, role: true },
    });
    return res.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[manager/profile] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// PATCH /api/manager/password — Changer son mot de passe
// ============================================================
managerRouter.patch("/password", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ ok: false, error: "Ancien mot de passe + nouveau (8+ chars) requis" });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: String(user.sub) } });
    if (!dbUser) return res.status(404).json({ ok: false, error: "Utilisateur introuvable" });

    const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!valid) return res.status(400).json({ ok: false, error: "Mot de passe actuel incorrect" });

    const samePassword = await bcrypt.compare(newPassword, dbUser.passwordHash);
    if (samePassword) return res.status(400).json({ ok: false, error: "Le nouveau mot de passe doit être différent" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: dbUser.id }, data: { passwordHash } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[manager/password] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/manager/sales
// ============================================================
managerRouter.get("/sales", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const sales = await prisma.sale.findMany({
      where: { organizationId: orgId },
      include: { customer: true, user: { select: { id: true, name: true } }, lines: { include: { product: true } }, payments: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ ok: true, data: sales, total: sales.length, limit: 50, offset: 0 });
  } catch (err) {
    console.error("[manager/sales] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/manager/products
// ============================================================
managerRouter.get("/products", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const products = await prisma.productService.findMany({
      where: { organizationId: orgId, active: true },
      orderBy: [{ profitCenter: "asc" }, { name: "asc" }],
    });
    return res.json({ ok: true, data: products });
  } catch (err) {
    console.error("[manager/products] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/manager/stock
// ============================================================
managerRouter.get("/stock", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const items = await prisma.stockItem.findMany({
      where: { organizationId: orgId },
      include: { movements: { take: 5, orderBy: { createdAt: "desc" } } },
      orderBy: { name: "asc" },
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[manager/stock] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/manager/treasury
// ============================================================
managerRouter.get("/treasury", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const envelopes = await prisma.treasuryEnvelope.findMany({
      where: { organizationId: orgId },
      orderBy: [{ isOperational: "desc" }, { name: "asc" }],
    });
    return res.json({ ok: true, data: envelopes });
  } catch (err) {
    console.error("[manager/treasury] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/manager/academia
// ============================================================
managerRouter.get("/academia", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const subs = await prisma.academiaSubscription.findMany({
      where: { organizationId: orgId },
      include: { customer: true },
      orderBy: { startedAt: "desc" },
    });
    return res.json({ ok: true, data: subs });
  } catch (err) {
    console.error("[manager/academia] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/manager/orders
// ============================================================
managerRouter.get("/orders", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const orders = await prisma.customerOrder.findMany({
      where: { organizationId: orgId },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ ok: true, data: orders });
  } catch (err) {
    console.error("[manager/orders] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// POST /api/manager/sales — Créer une vente
// ============================================================
const saleSchema = z.object({
  customerId: z.string().optional().nullable(),
  profitCenter: z.enum(["BOUTIQUE", "DESIGN", "TEXTILE", "ACADEMIA", "DEV"]),
  paymentMethod: z.enum(["ESPECES", "MOBILE_MONEY", "VIREMENT", "AUTRE"]),
  paymentReference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  lines: z.array(z.object({ productId: z.string(), quantity: z.number().positive(), unitPrice: z.number().positive() })).min(1),
});

managerRouter.post("/sales", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const userId = String(user.sub);
    const parsed = saleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });

    const { lines, paymentMethod, paymentReference, ...rest } = parsed.data;
    const totalAmount = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
    const year = new Date().getFullYear();
    const count = await prisma.sale.count({ where: { organizationId: orgId } });
    const number = `V-${year}-${String(count + 1).padStart(4, "0")}`;
    const openCash = await prisma.cashSession.findFirst({ where: { organizationId: orgId, userId, status: "OUVERTE" } });

    const sale = await prisma.sale.create({
      data: {
        number, organizationId: orgId, userId, cashSessionId: openCash?.id,
        totalAmount, paidAmount: totalAmount, status: "PAYEE", ...rest,
        lines: { create: lines.map((l) => ({ quantity: l.quantity, unitPrice: l.unitPrice, totalAmount: l.quantity * l.unitPrice, productId: l.productId })) },
        payments: { create: { method: paymentMethod, amount: totalAmount, reference: paymentReference || null } },
      },
      include: { lines: { include: { product: true } }, payments: true },
    });
    return res.status(201).json({ ok: true, data: sale });
  } catch (err) {
    console.error("[manager/sales/create] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET/POST /api/manager/cash — Sessions de caisse
// ============================================================
managerRouter.get("/cash", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const sessions = await prisma.cashSession.findMany({
      where: { organizationId: orgId },
      include: { user: { select: { name: true } }, sales: { select: { id: true, totalAmount: true, number: true } } },
      orderBy: { openedAt: "desc" },
      take: 20,
    });
    return res.json({ ok: true, data: sessions });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

managerRouter.post("/cash", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const userId = String(user.sub);

    if (req.body.openingAmount !== undefined) {
      const existing = await prisma.cashSession.findFirst({ where: { organizationId: orgId, userId, status: "OUVERTE" } });
      if (existing) return res.status(400).json({ ok: false, error: "Une session est déjà ouverte" });
      const cash = await prisma.cashSession.create({ data: { organizationId: orgId, userId, openingAmount: Number(req.body.openingAmount), status: "OUVERTE" } });
      return res.status(201).json({ ok: true, data: cash });
    }

    if (req.body.sessionId && req.body.closingAmount !== undefined) {
      const cash = await prisma.cashSession.findUnique({ where: { id: req.body.sessionId }, include: { sales: true } });
      if (!cash || cash.status !== "OUVERTE") return res.status(404).json({ ok: false, error: "Session introuvable ou clôturée" });
      const salesTotal = cash.sales.reduce((sum, s) => sum + s.totalAmount, 0);
      const theoretical = cash.openingAmount + salesTotal;
      const difference = Number(req.body.closingAmount) - theoretical;
      const updated = await prisma.cashSession.update({
        where: { id: cash.id },
        data: { closedAt: new Date(), closingAmount: Number(req.body.closingAmount), theoreticalAmount: theoretical, difference, differenceNote: req.body.differenceNote || null, status: Math.abs(difference) > 1 ? "ECART_NON_RESOLU" : "CLOTUREE" },
      });
      return res.json({ ok: true, data: updated });
    }

    return res.status(400).json({ ok: false, error: "Action non reconnue" });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET/POST /api/manager/expenses
// ============================================================
managerRouter.get("/expenses", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const expenses = await prisma.expense.findMany({
      where: { organizationId: orgId },
      include: { user: { select: { name: true } }, envelope: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ ok: true, data: expenses, total: expenses.length, limit: 50, offset: 0 });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

managerRouter.post("/expenses", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const userId = String(user.sub);
    const year = new Date().getFullYear();
    const count = await prisma.expense.count({ where: { organizationId: orgId } });
    const number = `D-${year}-${String(count + 1).padStart(4, "0")}`;
    const expense = await prisma.expense.create({
      data: {
        number, organizationId: orgId, userId,
        category: req.body.category, amount: Number(req.body.amount),
        vendor: req.body.vendor || null, description: req.body.description || null,
        profitCenter: req.body.profitCenter || null, envelopeId: req.body.envelopeId || null,
      },
    });
    return res.status(201).json({ ok: true, data: expense });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// POST /api/manager/payments/create — Créer une transaction FedaPay
// ============================================================
managerRouter.post("/payments/create", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const { amount, description, customerEmail, customerName, customerPhone, leadId } = req.body;
    const secretKey = process.env.FEDAPAY_SECRET_KEY;

    if (!secretKey) return res.status(500).json({ ok: false, error: "FedaPay non configuré" });

    const fedapayResponse = await fetch("https://api.fedapay.com/v1/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secretKey}` },
      body: JSON.stringify({
        transaction: { amount, description, currency: { iso: "XOF" } },
        customer: { email: customerEmail, firstname: customerName, ...(customerPhone && { phone_number: customerPhone }) },
      }),
    });

    if (!fedapayResponse.ok) return res.status(500).json({ ok: false, error: "Erreur FedaPay" });

    const fedapayData = await fedapayResponse.json();
    const transactionId = fedapayData?.id || fedapayData?.transaction?.id;

    if (leadId) {
      await prisma.customerOrder.update({ where: { id: leadId }, data: { price: amount, status: "EN_PRODUCTION" } }).catch(() => {});
    }
    await prisma.auditEvent.create({ data: { action: "payment.create", entity: "Payment", entityId: String(transactionId || ""), details: `Transaction FedaPay: ${amount} FCFA pour ${customerName}`, userId: String(user.sub) } }).catch(() => {});

    return res.json({ ok: true, publicKey: process.env.FEDAPAY_PUBLIC_KEY, transaction: { id: transactionId, amount, description }, customer: { email: customerEmail, lastname: customerName, ...(customerPhone && { phone_number: customerPhone }) } });
  } catch (err) {
    console.error("[payments/create] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// POST /api/manager/payments/:paymentId/verify
// ============================================================
managerRouter.post("/payments/:paymentId/verify", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const paymentId = req.params.paymentId;
    const secretKey = process.env.FEDAPAY_SECRET_KEY;
    if (!secretKey) return res.status(500).json({ ok: false, error: "FedaPay non configuré" });

    const response = await fetch(`https://api.fedapay.com/v1/transactions/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return res.status(502).json({ ok: false, error: "Erreur vérification FedaPay" });

    const data = await response.json();
    const status = data?.status || data?.transaction?.status;
    const isPaid = status === "completed" || status === "approved" || status === "paid";

    if (isPaid) {
      await prisma.auditEvent.create({ data: { action: "payment.verified", entity: "Payment", entityId: paymentId, details: `Paiement vérifié: ${status}`, userId: String(user.sub) } }).catch(() => {});
    }

    return res.json({ ok: true, status, isPaid, amount: data?.amount || data?.transaction?.amount, data });
  } catch (err) {
    console.error("[payments/verify] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});
