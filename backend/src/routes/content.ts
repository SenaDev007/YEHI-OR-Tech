import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "./auth";

/**
 * Routes de gestion du contenu public (pattern Win-Agro).
 * Toutes les routes sont protégées par authMiddleware (authentification requise).
 *
 * Modèles gérés :
 *  - ServiceContent (services affichés sur /services et homepage)
 *  - StatContent (statistiques affichées sur homepage)
 *  - PortfolioItem (réalisations affichées sur /portfolio)
 *  - PricingPack (packs tarifaires affichés sur /tarifs)
 *  - Testimonial (témoignages clients)
 *  - PageContent (contenu générique key-value pour héros, À propos, etc.)
 *
 * Les routes publiques (GET sans auth) sont dans routes/leads.ts et
 * dans le frontend Next.js (src/app/api/.../route.ts).
 */

export const contentRouter = Router();
contentRouter.use(authMiddleware);

// ============================================================
// SERVICES
// ============================================================
const serviceSchema = z.object({
  slug: z.string().min(1),
  number: z.string().optional(),
  title: z.string().min(1),
  icon: z.string().default("Code"),
  tagline: z.string().default(""),
  availability: z.string().default("sur-devis"),
  availabilityLabel: z.string().default("Sur devis"),
  problem: z.string().optional(),
  fullDescription: z.string().optional(),
  deliverables: z.array(z.string()).default([]),
  targetAudience: z.array(z.string()).default([]),
  commercialLimit: z.string().optional(),
  formFields: z.array(z.string()).default([]),
  faq: z.any().optional(),
  tags: z.array(z.string()).default([]),
  cta: z.string().default("Démarrer ce service →"),
  gradient: z.string().default("linear-gradient(135deg, #F5B700 0%, #071A2F 100%)"),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

contentRouter.get("/services", async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as { user: Record<string, unknown> }).user;
    const orgId = String(user.organizationId);
    const items = await prisma.serviceContent.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/services] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/services", async (req: Request, res: Response) => {
  try {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.serviceContent.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/services] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/services/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = serviceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.serviceContent.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/services] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/services/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.serviceContent.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/services] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// STATS
// ============================================================
const statSchema = z.object({
  value: z.number().int(),
  suffix: z.string().optional(),
  label: z.string().min(1),
  meaning: z.string().optional(),
  section: z.string().default("homepage"),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

contentRouter.get("/stats", async (req: Request, res: Response) => {
  try {
    const items = await prisma.statContent.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/stats] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/stats", async (req: Request, res: Response) => {
  try {
    const parsed = statSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.statContent.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/stats] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/stats/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = statSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.statContent.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/stats] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/stats/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.statContent.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/stats] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// PORTFOLIO
// ============================================================
const portfolioSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string().default("Application"),
  categorySlug: z.string().default("applications"),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.string().default("live"),
  statusLabel: z.string().default("En production"),
  gradient: z.string().default("linear-gradient(135deg, #F5B700 0%, #071A2F 100%)"),
  iconName: z.string().default("Code"),
  tech: z.array(z.string()).default([]),
  url: z.string().optional(),
  previewImage: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

contentRouter.get("/portfolio", async (req: Request, res: Response) => {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/portfolio] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/portfolio", async (req: Request, res: Response) => {
  try {
    const parsed = portfolioSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.portfolioItem.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/portfolio] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/portfolio/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = portfolioSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.portfolioItem.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/portfolio] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/portfolio/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.portfolioItem.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/portfolio] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// PRICING PACKS
// ============================================================
const pricingSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int(),
  currency: z.string().default("FCFA"),
  period: z.string().optional(),
  description: z.string().optional(),
  tagline: z.string().optional(),
  features: z.array(z.string()).default([]),
  featureDetails: z.any().optional(),
  cta: z.string().default("Choisir ce pack"),
  badge: z.string().optional(),
  badgeColor: z.string().optional(),
  color: z.string().optional(),
  category: z.string().optional(),
  deliveryTime: z.string().optional(),
  supportIncluded: z.string().optional(),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

contentRouter.get("/pricing", async (req: Request, res: Response) => {
  try {
    const items = await prisma.pricingPack.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/pricing] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/pricing", async (req: Request, res: Response) => {
  try {
    const parsed = pricingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.pricingPack.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/pricing] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/pricing/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = pricingSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.pricingPack.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/pricing] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/pricing/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pricingPack.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/pricing] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// TESTIMONIALS
// ============================================================
const testimonialSchema = z.object({
  text: z.string().min(1),
  highlight: z.string().optional(),
  authorName: z.string().min(1),
  authorRole: z.string().default(""),
  authorAvatar: z.string().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

contentRouter.get("/testimonials", async (req: Request, res: Response) => {
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/testimonials] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/testimonials", async (req: Request, res: Response) => {
  try {
    const parsed = testimonialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.testimonial.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/testimonials] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/testimonials/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = testimonialSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.testimonial.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/testimonials] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/testimonials/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/testimonials] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// PAGE CONTENT (key-value générique pour héros, À propos, etc.)
// ============================================================
const pageContentSchema = z.object({
  page: z.string().min(1),
  section: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
});

contentRouter.get("/page-content", async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const where = page ? { page: String(page) } : {};
    const items = await prisma.pageContent.findMany({
      where,
      orderBy: [{ page: "asc" }, { section: "asc" }, { key: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/page-content] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/page-content", async (req: Request, res: Response) => {
  try {
    const parsed = pageContentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: parsed.data.page,
          section: parsed.data.section,
          key: parsed.data.key,
        },
      },
      update: { value: parsed.data.value },
      create: {
        page: parsed.data.page,
        section: parsed.data.section,
        key: parsed.data.key,
        value: parsed.data.value,
      },
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/page-content] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/page-content/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pageContent.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/page-content] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});
