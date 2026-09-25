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

// ============================================================
// VALUES (page À propos)
// ============================================================
const valueSchema = z.object({
  number: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().default("Star"),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

contentRouter.get("/values", async (req: Request, res: Response) => {
  try {
    const items = await prisma.valueContent.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/values] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/values", async (req: Request, res: Response) => {
  try {
    const parsed = valueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.valueContent.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/values] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/values/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = valueSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.valueContent.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/values] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/values/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.valueContent.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/values] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// PROCESS STEPS
// ============================================================
const processStepSchema = z.object({
  number: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().default("Search"),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

contentRouter.get("/process-steps", async (req: Request, res: Response) => {
  try {
    const items = await prisma.processStepContent.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/process-steps] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/process-steps", async (req: Request, res: Response) => {
  try {
    const parsed = processStepSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.processStepContent.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/process-steps] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/process-steps/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = processStepSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.processStepContent.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/process-steps] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/process-steps/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.processStepContent.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/process-steps] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// FAQ ITEMS
// ============================================================
const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().default("general"),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

contentRouter.get("/faq", async (req: Request, res: Response) => {
  try {
    const items = await prisma.fAQItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/faq] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/faq", async (req: Request, res: Response) => {
  try {
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.fAQItem.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/faq] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/faq/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = faqSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.fAQItem.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/faq] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/faq/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.fAQItem.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/faq] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// SAAS HUB — Gestion des apps SaaS et tenants
// ============================================================
const saasAppSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().default("App"),
  apiUrl: z.string().optional(),
  apiKey: z.string().optional(),
  publicUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

contentRouter.get("/saas-apps", async (req: Request, res: Response) => {
  try {
    const items = await prisma.saasApp.findMany({
      orderBy: [{ createdAt: "asc" }],
      include: { _count: { select: { tenants: true } } },
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/saas-apps] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/saas-apps", async (req: Request, res: Response) => {
  try {
    const parsed = saasAppSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.saasApp.create({ data: parsed.data as never });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/saas-apps] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/saas-apps/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = saasAppSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const updated = await prisma.saasApp.update({
      where: { id },
      data: parsed.data as never,
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/saas-apps] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.delete("/saas-apps/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.saasApp.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/saas-apps] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

const saasTenantSchema = z.object({
  appId: z.string().min(1),
  externalId: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  plan: z.string().default("SEED"),
  status: z.string().default("trial"),
  studentCount: z.number().int().default(0),
  studentMin: z.number().int().default(1),
  studentMax: z.number().int().nullable().optional(),
  billingCycle: z.string().default("ANNUAL"),
  amount: z.number().int().default(0),
  initialFee: z.number().int().default(0),
  initialFeePaid: z.boolean().default(false),
  yearlyAmount: z.number().int().default(0),
  bilingualEnabled: z.boolean().default(false),
  bilingualAmount: z.number().int().default(0),
  schoolsCount: z.number().int().default(1),
  startDate: z.any().optional(),
  activationDate: z.any().optional(),
  trialEndsAt: z.any().optional(),
  annualDueDate: z.any().optional(),
  nextPaymentDueAt: z.any().optional(),
  metadata: z.any().optional(),
});

contentRouter.get("/saas-tenants", async (req: Request, res: Response) => {
  try {
    const { appId, status } = req.query;
    const where: Record<string, unknown> = {};
    if (appId) where.appId = String(appId);
    if (status) where.status = String(status);

    const items = await prisma.saasTenant.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      include: { app: true },
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[content/saas-tenants] GET erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.post("/saas-tenants", async (req: Request, res: Response) => {
  try {
    const parsed = saasTenantSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const created = await prisma.saasTenant.create({
      data: {
        ...parsed.data,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : new Date(),
        activationDate: parsed.data.activationDate ? new Date(parsed.data.activationDate) : null,
        trialEndsAt: parsed.data.trialEndsAt ? new Date(parsed.data.trialEndsAt) : null,
        annualDueDate: parsed.data.annualDueDate ? new Date(parsed.data.annualDueDate) : null,
        nextPaymentDueAt: parsed.data.nextPaymentDueAt ? new Date(parsed.data.nextPaymentDueAt) : null,
      } as never,
      include: { app: true },
    });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.error("[content/saas-tenants] POST erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

contentRouter.put("/saas-tenants/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = saasTenantSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message });
    }
    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.startDate) data.startDate = new Date(parsed.data.startDate);
    if (parsed.data.activationDate) data.activationDate = new Date(parsed.data.activationDate);
    if (parsed.data.trialEndsAt) data.trialEndsAt = new Date(parsed.data.trialEndsAt);
    if (parsed.data.annualDueDate) data.annualDueDate = new Date(parsed.data.annualDueDate);
    if (parsed.data.nextPaymentDueAt) data.nextPaymentDueAt = new Date(parsed.data.nextPaymentDueAt);

    const updated = await prisma.saasTenant.update({
      where: { id },
      data: data as never,
      include: { app: true },
    });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[content/saas-tenants] PUT erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// SYNC ACADEMIA HELM — proxy vers l'API Academia Helm
// ============================================================
// Utilise l'endpoint /platform/tenants/create-manual qui fait l'onboarding
// complet en une seule requête (sans paiement, mode admin).
//
// Headers requis :
//  - x-platform-admin-email (vérifié par assertAdminProxyRequest côté Academia Helm)
//
// Env vars requises sur Railway :
//  - ACADEMIA_HELM_API_URL (ex: https://api.academiahelm.com)
//  - ACADEMIA_HELM_ADMIN_EMAIL (email d'un compte Platform Super Admin)
// ============================================================
contentRouter.post("/saas-tenants/:id/sync-academia-helm", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenant = await prisma.saasTenant.findUnique({
      where: { id },
      include: { app: true },
    });
    if (!tenant) {
      return res.status(404).json({ ok: false, error: "Tenant introuvable" });
    }
    if (tenant.app?.slug !== "academia-helm") {
      return res.status(400).json({ ok: false, error: "Cette action ne s'applique qu'aux tenants Academia Helm" });
    }

    const ACADEMIA_HELM_API_URL = process.env.ACADEMIA_HELM_API_URL?.replace(/\/$/, "");
    const ADMIN_EMAIL = process.env.ACADEMIA_HELM_ADMIN_EMAIL;

    if (!ACADEMIA_HELM_API_URL) {
      return res.status(500).json({
        ok: false,
        error: "ACADEMIA_HELM_API_URL non configuré sur Railway.",
      });
    }
    if (!ADMIN_EMAIL) {
      return res.status(500).json({
        ok: false,
        error: "ACADEMIA_HELM_ADMIN_EMAIL non configuré sur Railway.",
      });
    }

    // Validation des champs requis
    if (!tenant.name || !tenant.contactEmail) {
      return res.status(400).json({
        ok: false,
        error: "Le tenant doit avoir un nom + un email contact pour être synchronisé.",
      });
    }

    // Marquer comme "sync en cours"
    await prisma.saasTenant.update({
      where: { id },
      data: { syncStatus: "pending", syncError: null },
    });

    // Construire le payload pour /platform/tenants/create-manual
    const [firstName, ...lastNameParts] = (tenant.contactName || tenant.name).split(" ");
    const lastName = lastNameParts.join(" ") || "—";
    // Mot de passe temporaire — le promoteur devra le changer au 1er login
    // Format respecte les règles de mot de passe Academia Helm (8+ chars, 3 des 4 types)
    const tempPassword = `YehiOr${Date.now().toString(36)}!`;

    const payload = {
      schoolName: tenant.name,
      schoolType: (tenant.metadata as Record<string, string>)?.schoolType || "MIXTE",
      city: (tenant.metadata as Record<string, string>)?.city || "Parakou",
      country: (tenant.metadata as Record<string, string>)?.country || "Bénin",
      phone: tenant.contactPhone || "+22900000000",
      email: tenant.contactEmail,
      bilingual: tenant.bilingualEnabled,
      preferredSubdomain: tenant.slug || "",
      plan: tenant.plan, // SEED | GROW | LEAD | NETWORK
      billingCycle: "ANNUAL", // Academia Helm = abonnement annuel
      paymentMethod: "CASH", // Mode admin — pas de paiement réel
      promoterFirstName: firstName,
      promoterLastName: lastName,
      promoterEmail: tenant.contactEmail,
      promoterPhone: tenant.contactPhone || "+22900000000",
      promoterPassword: tempPassword,
      estimatedStudentCount: tenant.studentCount,
      schoolsCount: tenant.schoolsCount,
    };

    console.log(`[sync-academia-helm] Appel ${ACADEMIA_HELM_API_URL}/platform/tenants/create-manual pour ${tenant.name} (${tenant.plan})`);

    // Appel API Academia Helm
    const apiRes = await fetch(`${ACADEMIA_HELM_API_URL}/platform/tenants/create-manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-platform-admin-email": ADMIN_EMAIL,
        "User-Agent": "YEHI-OR-Tech-Manager/1.0",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!apiRes.ok) {
      let errText: string;
      try {
        const errJson = await apiRes.json() as { message?: string | string[]; error?: string };
        errText = Array.isArray(errJson.message) ? errJson.message.join(", ") : (errJson.message || errJson.error || `HTTP ${apiRes.status}`);
      } catch {
        errText = await apiRes.text().catch(() => `HTTP ${apiRes.status}`);
      }

      await prisma.saasTenant.update({
        where: { id },
        data: {
          syncStatus: "error",
          syncError: `Academia Helm API: ${errText.slice(0, 300)}`,
        },
      });
      return res.status(502).json({
        ok: false,
        error: `Erreur Academia Helm: ${errText.slice(0, 300)}`,
      });
    }

    const result = await apiRes.json() as {
      tenantId?: string;
      subdomain?: string;
      hostname?: string;
      siteUrl?: string;
      portalUrl?: string;
      firstTenantSubdomain?: string;
      message?: string;
    };

    const externalId = result.tenantId || result.subdomain;
    const subdomain = result.subdomain || result.firstTenantSubdomain;

    // Mettre à jour le tenant local avec l'ID distant + marquer synchronisé
    const updated = await prisma.saasTenant.update({
      where: { id },
      data: {
        externalId,
        slug: tenant.slug || subdomain,
        syncStatus: "synced",
        syncError: null,
        lastSyncAt: new Date(),
        activationDate: tenant.activationDate || new Date(),
        // Stocker les URLs Academia Helm dans metadata
        metadata: {
          ...(tenant.metadata as Record<string, unknown> | null),
          subdomain,
          hostname: result.hostname,
          siteUrl: result.siteUrl,
          portalUrl: result.portalUrl,
          tempPassword, // ⚠️ temporaire — à communiquer au promoteur
          syncedAt: new Date().toISOString(),
        },
      },
      include: { app: true },
    });

    const successMsg = `✅ Tenant synchronisé avec Academia Helm !
• Tenant ID: ${externalId || "—"}
• Sous-domaine: ${subdomain || tenant.slug || "—"}
• URL portail: ${result.portalUrl || "—"}
• Mot de passe temporaire du promoteur: ${tempPassword} (à communiquer + demander changement à la 1ère connexion)`;

    return res.json({
      ok: true,
      data: updated,
      message: successMsg,
    });
  } catch (err) {
    console.error("[content/saas-tenants/sync] erreur:", err);
    try {
      const { id } = req.params;
      await prisma.saasTenant.update({
        where: { id },
        data: {
          syncStatus: "error",
          syncError: err instanceof Error ? err.message.slice(0, 300) : "Erreur inconnue",
        },
      });
    } catch {}

    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : "Erreur serveur",
    });
  }
});

contentRouter.delete("/saas-tenants/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.saasTenant.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[content/saas-tenants] DELETE erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});
