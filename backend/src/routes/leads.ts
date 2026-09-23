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
 * Stocké en DB + (optionnel) envoi email via Resend.
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
    if (!org) {
      return res.status(500).json({ ok: false, error: "Organisation introuvable" });
    }

    // Crée un Customer (s'il n'existe pas déjà par email)
    const customer = await prisma.customer.upsert({
      where: { id: `lead-${data.email.toLowerCase()}` },
      update: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      create: {
        id: `lead-${data.email.toLowerCase()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: "PARTICULIER",
        organizationId: org.id,
      },
    });

    // Crée une commande (lead) associée
    const year = new Date().getFullYear();
    const count = await prisma.customerOrder.count();
    const number = `LEAD-${year}-${String(count + 1).padStart(4, "0")}`;

    const order = await prisma.customerOrder.create({
      data: {
        number,
        title: `Demande : ${data.service}`,
        description: data.message + (data.budget ? `\nBudget : ${data.budget}` : "") + (data.company ? `\nEntreprise : ${data.company}` : ""),
        price: 0, // à chiffrer par l'équipe
        status: "NOUVELLE",
        profitCenter: "DEV",
        organizationId: org.id,
        customerId: customer.id,
      },
    });

    // Audit
    await prisma.auditEvent.create({
      data: {
        action: "lead.create",
        entity: "CustomerOrder",
        entityId: order.id,
        details: `Lead ${number} créé depuis le site public : ${data.service}`,
      },
    });

    // Optionnel : envoi email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || "noreply@yehiortech.com",
          to: process.env.RESEND_TO || "contact@yehiortech.com",
          subject: `Nouveau lead : ${data.service} — ${data.name}`,
          html: `
            <h2>Nouvelle demande de devis</h2>
            <p><strong>Nom :</strong> ${data.name}</p>
            <p><strong>Email :</strong> ${data.email}</p>
            <p><strong>Téléphone :</strong> ${data.phone || "—"}</p>
            <p><strong>Entreprise :</strong> ${data.company || "—"}</p>
            <p><strong>Service :</strong> ${data.service}</p>
            <p><strong>Budget :</strong> ${data.budget || "À discuter"}</p>
            <p><strong>Message :</strong></p>
            <p>${data.message}</p>
            <hr>
            <p><small>N° ${number} — Traiter dans le CMS : ${process.env.FRONTEND_URL || ""}/manager/sales</small></p>
          `,
        });
      } catch (emailErr) {
        console.warn("[leads] Email envoi échoué:", emailErr);
      }
    }

    return res.status(201).json({
      ok: true,
      leadNumber: number,
      message: "Demande reçue. Tu recevras une réponse sous 48h.",
    });
  } catch (err) {
    return next(err);
  }
});
