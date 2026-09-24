import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { ROLES } from "@/lib/types";

/**
 * GET /api/manager/users
 * Liste tous les utilisateurs (ADMIN seulement).
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ ok: false, error: "Accès refusé" }, { status: 403 });

  const users = await prisma.user.findMany({
    where: { organizationId: session.organizationId },
    select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, data: users });
}

const createUserSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum"),
  role: z.enum(ROLES as [string, ...string[]]),
});

/**
 * POST /api/manager/users
 * Crée un nouvel utilisateur (ADMIN seulement).
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ ok: false, error: "Accès refusé" }, { status: 403 });

  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Données invalides" }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    // Vérifie que l'email n'existe pas déjà
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Cet email est déjà utilisé." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), passwordHash, role, organizationId: session.organizationId },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });

    await prisma.auditEvent.create({
      data: { action: "user.create", entity: "User", entityId: user.id, details: `Utilisateur créé : ${name} (${email}) — rôle ${role}`, userId: session.sub },
    });

    return NextResponse.json({ ok: true, data: user }, { status: 201 });
  } catch (err) {
    console.error("[users/create] Erreur:", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PATCH /api/manager/users
 * Met à jour un utilisateur (activer/désactiver, changer rôle).
 * Body: { userId, active?, role? }
 */
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ ok: false, error: "Accès refusé" }, { status: 403 });

  try {
    const body = await request.json();
    const { userId, active, role } = body;

    if (!userId) return NextResponse.json({ ok: false, error: "userId requis" }, { status: 400 });

    // Ne pas désactiver son propre compte
    if (userId === session.sub && active === false) {
      return NextResponse.json({ ok: false, error: "Tu ne peux pas désactiver ton propre compte." }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (typeof active === "boolean") data.active = active;
    if (role) data.role = role;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true, active: true },
    });

    await prisma.auditEvent.create({
      data: { action: "user.update", entity: "User", entityId: userId, details: `Utilisateur mis à jour : ${updated.name}`, userId: session.sub },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[users/update] Erreur:", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
