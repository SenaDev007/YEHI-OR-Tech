import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

/**
 * POST /api/auth/login
 * Authentifie un utilisateur et pose le cookie de session.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Identifiants invalides." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { organization: true },
    });

    if (!user || !user.active) {
      return NextResponse.json(
        { ok: false, error: "Identifiants incorrects ou compte désactivé." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Crée la session
    await createSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role as never,
      organizationId: user.organizationId,
    });

    // Audit
    await prisma.auditEvent.create({
      data: {
        action: "login",
        entity: "User",
        entityId: user.id,
        details: `Connexion réussie depuis ${request.headers.get("user-agent")?.slice(0, 100) || "unknown"}`,
        userId: user.id,
      },
    });

    return NextResponse.json({
      ok: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[auth/login] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessaie." },
      { status: 500 }
    );
  }
}
