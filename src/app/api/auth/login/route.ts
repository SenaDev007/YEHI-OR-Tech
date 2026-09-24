import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, signSession } from "@/lib/auth";
import { queryWithFallback } from "@/lib/db-pg";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

/**
 * POST /api/auth/login
 * Authentifie un utilisateur et pose le cookie de session.
 * Utilise Prisma en priorité, avec fallback pg (pure JS) si Prisma échoue.
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
    const emailLower = email.toLowerCase();

    // Tente Prisma d'abord, fallback pg si échec
    let userRow: { id: string; email: string; name: string; role: string; active: boolean; passwordhash: string; organizationid: string } | null = null;

    try {
      const user = await prisma.user.findUnique({
        where: { email: emailLower },
        include: { organization: true },
      });
      if (user) {
        userRow = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          active: user.active,
          passwordhash: user.passwordHash,
          organizationid: user.organizationId,
        };
      }
    } catch (prismaErr) {
      console.warn("[auth/login] Prisma failed, trying pg fallback:", prismaErr instanceof Error ? prismaErr.message : "unknown");
      // Fallback: use pg (pure JS, works in restricted networks)
      const result = await queryWithFallback(
        'SELECT id, email, name, role, active, "passwordHash", "organizationId" FROM "User" WHERE email = $1',
        [emailLower]
      );
      if (result.rows.length > 0) {
        const r = result.rows[0];
        userRow = {
          id: r.id,
          email: r.email,
          name: r.name,
          role: r.role,
          active: r.active,
          passwordhash: r.passwordHash,
          organizationid: r.organizationId,
        };
      }
    }

    if (!userRow || !userRow.active) {
      return NextResponse.json(
        { ok: false, error: "Identifiants incorrects ou compte désactivé." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, userRow.passwordhash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Crée la session
    await createSession({
      sub: userRow.id,
      email: userRow.email,
      name: userRow.name,
      role: userRow.role as never,
      organizationId: userRow.organizationid,
    });

    // Génère un token JWT explicite pour le client (compatible backend Railway)
    // — le cookie HTTP-only est posé par createSession, mais on renvoie aussi
    // le token dans le JSON pour que api-client.ts le stocke côté client.
    const token = await signSession({
      sub: userRow.id,
      email: userRow.email,
      name: userRow.name,
      role: userRow.role as never,
      organizationId: userRow.organizationid,
    });

    // Audit (best-effort, ne bloque pas si DB échoue)
    try {
      await prisma.auditEvent.create({
        data: {
          action: "login",
          entity: "User",
          entityId: userRow.id,
          details: `Connexion réussie depuis ${request.headers.get("user-agent")?.slice(0, 100) || "unknown"}`,
          userId: userRow.id,
        },
      });
    } catch {
      // Audit non bloquant
    }

    return NextResponse.json({
      ok: true,
      token,
      user: {
        email: userRow.email,
        name: userRow.name,
        role: userRow.role,
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
