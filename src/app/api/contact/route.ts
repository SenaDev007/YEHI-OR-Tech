import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2, "Ce champ est nécessaire pour traiter ta demande."),
  email: z.string().email("Cette adresse email n'a pas l'air valide."),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Indique le service souhaité pour qu'on traite ta demande."),
  budget: z.string().optional(),
  message: z.string().min(20, "Quelques mots de plus nous aideraient à comprendre ton besoin."),
});

/**
 * POST /api/contact
 * Reçoit une demande de devis/devis depuis le site public.
 * Crée un CustomerOrder en DB (visible dans le CMS /manager) + envoie un email
 * à l'équipe si RESEND_API_KEY est configuré.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { name, email, phone, company, service, budget, message } = parsed.data;

    // Récupère l'organisation
    const org = await prisma.organization.findFirst();
    if (!org) {
      return NextResponse.json(
        { ok: false, error: "Organisation introuvable" },
        { status: 500 }
      );
    }

    // Crée ou récupère un Customer
    const customerId = `lead-${email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const customer = await prisma.customer.upsert({
      where: { id: customerId },
      update: { name, email, phone },
      create: {
        id: customerId,
        name,
        email,
        phone,
        type: "PARTICULIER",
        organizationId: org.id,
      },
    });

    // Crée une CustomerOrder (lead) — visible dans le CMS /manager
    const year = new Date().getFullYear();
    const count = await prisma.customerOrder.count();
    const leadNumber = `LEAD-${year}-${String(count + 1).padStart(4, "0")}`;

    const order = await prisma.customerOrder.create({
      data: {
        number: leadNumber,
        title: `Demande : ${service}`,
        description:
          message +
          (budget ? `\nBudget : ${budget}` : "") +
          (company ? `\nEntreprise : ${company}` : "") +
          (phone ? `\nTéléphone : ${phone}` : ""),
        price: 0,
        status: "NOUVELLE",
        profitCenter: "DEV",
        organizationId: org.id,
        customerId: customer.id,
      },
    });

    // Audit log
    await prisma.auditEvent.create({
      data: {
        action: "lead.create",
        entity: "CustomerOrder",
        entityId: order.id,
        details: `Lead ${leadNumber} créé depuis le site public : ${service}`,
      },
    });

    // Envoi email optionnel via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || "noreply@yehiortech.com",
          to: process.env.RESEND_TO || "contact@yehiortech.com",
          subject: `Nouveau lead : ${service} — ${name}`,
          html: `
            <h2>Nouvelle demande de devis</h2>
            <p><strong>N° :</strong> ${leadNumber}</p>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Téléphone :</strong> ${phone || "—"}</p>
            <p><strong>Entreprise :</strong> ${company || "—"}</p>
            <p><strong>Service :</strong> ${service}</p>
            <p><strong>Budget :</strong> ${budget || "À discuter"}</p>
            <p><strong>Message :</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
            <hr>
            <p><small>Traiter dans le CMS : /manager/sales</small></p>
          `,
        });
      } catch (emailErr) {
        console.warn("[contact] Email envoi échoué:", emailErr);
      }
    }

    // Log server-side
    console.log("[contact] Nouveau lead reçu", {
      timestamp: new Date().toISOString(),
      leadNumber,
      name,
      email,
      service,
    });

    return NextResponse.json({
      ok: true,
      leadNumber,
      message: "Demande reçue. Tu auras une réponse sous 48h, souvent avant.",
    });
  } catch (err) {
    console.error("[contact] Erreur serveur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Écris-nous directement sur WhatsApp, ça ira plus vite." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "contact-form-v2" });
}
