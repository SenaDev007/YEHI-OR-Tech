import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const leadsRouter = Router();

const leadSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Service requis"),
  budget: z.string().optional(),
  message: z.string().min(20, "Message trop court (min 20 caractères)"),
});

/**
 * POST /api/leads
 * Reçoit une demande de devis depuis le site public.
 */
leadsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: parsed.error.issues[0]?.message || "Données invalides",
      });
    }

    const data = parsed.data;
    const org = await prisma.organization.findFirst();
    if (!org) return res.status(500).json({ ok: false, error: "Organisation introuvable" });

    const customerId = `lead-${data.email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const customer = await prisma.customer.upsert({
      where: { id: customerId },
      update: { name: data.name, email: data.email, phone: data.phone },
      create: { id: customerId, name: data.name, email: data.email, phone: data.phone, type: "PARTICULIER", organizationId: org.id },
    });

    const year = new Date().getFullYear();
    const count = await prisma.customerOrder.count();
    const leadNumber = `LEAD-${year}-${String(count + 1).padStart(4, "0")}`;

    const order = await prisma.customerOrder.create({
      data: {
        number: leadNumber,
        title: `Demande : ${data.service}`,
        description: data.message + (data.budget ? `\nBudget : ${data.budget}` : "") + (data.company ? `\nEntreprise : ${data.company}` : ""),
        price: 0,
        status: "NOUVELLE",
        profitCenter: "DEV",
        organizationId: org.id,
        customerId: customer.id,
      },
    });

    await prisma.auditEvent.create({
      data: { action: "lead.create", entity: "CustomerOrder", entityId: order.id, details: `Lead ${leadNumber} créé : ${data.service}` },
    }).catch(() => {});

    // Envoi email optionnel
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || "noreply@yehiortech.com",
          to: process.env.RESEND_TO || "contact@yehiortech.com",
          subject: `Nouveau lead : ${data.service} — ${data.name}`,
          html: `<h2>Nouvelle demande</h2><p>Nom: ${data.name}</p><p>Email: ${data.email}</p><p>Tel: ${data.phone || "—"}</p><p>Service: ${data.service}</p><p>Budget: ${data.budget || "À discuter"}</p><p>Message: ${data.message}</p><p>N° ${leadNumber}</p>`,
        });
      } catch {}
    }

    return res.status(201).json({ ok: true, leadNumber, message: "Demande reçue. Tu auras une réponse sous 48h." });
  } catch (err) {
    console.error("[leads] Erreur:", err);
    return next(err);
  }
});

/**
 * GET /api/leads/public-settings
 * Retourne les paramètres publics du site (sans auth).
 */
leadsRouter.get("/public-settings", async (req: Request, res: Response) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings) {
      return res.json({
        ok: true,
        settings: {
          whatsappNumber: settings.whatsappNumber,
          contactEmail: settings.contactEmail,
          phoneNumber: settings.phoneNumber,
          hours: settings.hours,
          address: settings.address,
          socialLinkedin: settings.socialLinkedin,
          socialFacebook: settings.socialFacebook,
          socialWhatsapp: settings.socialWhatsapp,
        },
      });
    }
  } catch {}
  return res.json({
    ok: true,
    settings: {
      whatsappNumber: "2290141360803",
      contactEmail: "contact@yehiortech.com",
      phoneNumber: "+229 01 41 36 08 03",
      hours: "Lundi à samedi, 8h à 20h (GMT+1)",
      address: "Parakou, Bénin — Afrique de l'Ouest",
      socialLinkedin: "https://www.linkedin.com/company/yehi-or-tech",
      socialFacebook: "https://www.facebook.com/yehiortech",
      socialWhatsapp: "https://wa.me/2290141360803",
    },
  });
});

// ============================================================
// CONTENU PUBLIC — Lecture seule (sans auth)
// Pattern Win-Agro : les pages publiques consomment ces endpoints
// ============================================================

leadsRouter.get("/services", async (req: Request, res: Response) => {
  try {
    const items = await prisma.serviceContent.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[public/services] erreur:", err);
    return res.json({ ok: true, data: [] }); // dégrade silencieusement
  }
});

leadsRouter.get("/stats", async (req: Request, res: Response) => {
  try {
    const items = await prisma.statContent.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[public/stats] erreur:", err);
    return res.json({ ok: true, data: [] });
  }
});

leadsRouter.get("/portfolio", async (req: Request, res: Response) => {
  try {
    const items = await prisma.portfolioItem.findMany({
      where: { isActive: true, status: "live" },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[public/portfolio] erreur:", err);
    return res.json({ ok: true, data: [] });
  }
});

leadsRouter.get("/pricing", async (req: Request, res: Response) => {
  try {
    const items = await prisma.pricingPack.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[public/pricing] erreur:", err);
    return res.json({ ok: true, data: [] });
  }
});

leadsRouter.get("/testimonials", async (req: Request, res: Response) => {
  try {
    const items = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[public/testimonials] erreur:", err);
    return res.json({ ok: true, data: [] });
  }
});

leadsRouter.get("/page-content", async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const where = page ? { page: String(page) } : {};
    const items = await prisma.pageContent.findMany({ where });
    // Reformate en objet { section_key: value } pour faciliter la conso
    const result: Record<string, string> = {};
    for (const item of items) {
      result[`${item.section}_${item.key}`] = item.value;
    }
    return res.json({ ok: true, data: result });
  } catch (err) {
    console.error("[public/page-content] erreur:", err);
    return res.json({ ok: true, data: {} });
  }
});

// ============================================================
// CONTENU PUBLIC — Values, ProcessSteps, FAQ
// ============================================================

leadsRouter.get("/values", async (req: Request, res: Response) => {
  try {
    const items = await prisma.valueContent.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[public/values] erreur:", err);
    return res.json({ ok: true, data: [] });
  }
});

leadsRouter.get("/process-steps", async (req: Request, res: Response) => {
  try {
    const items = await prisma.processStepContent.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[public/process-steps] erreur:", err);
    return res.json({ ok: true, data: [] });
  }
});

leadsRouter.get("/faq", async (req: Request, res: Response) => {
  try {
    const items = await prisma.fAQItem.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return res.json({ ok: true, data: items });
  } catch (err) {
    console.error("[public/faq] erreur:", err);
    return res.json({ ok: true, data: [] });
  }
});
