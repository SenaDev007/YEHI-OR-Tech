import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, createSession, signSession } from "@/lib/auth";
import { queryWithFallback } from "@/lib/db-pg";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

/**
 * POST /api/auth/login
 * Authentifie un utilisateur et pose le cookie de session.
 *
 * SUR VERCEL : on SAUTE Prisma entièrement. Le moteur Rust de Prisma ne
 * peut pas joindre Neon depuis le runtime serverless de Vercel — il
 * attend 5-10s avant d'échouer, ce qui déclenche le timeout 10s du client.
 * On utilise directement pg (pure JS) qui fonctionne.
 *
 * SUR RAILWAY (backend) : Prisma est utilisé (processus chaud, pool ouvert).
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

    // === STRATÉGIE 1 : pg direct (toujours, sur Vercel) ===
    // 5s timeout max dans db-pg.ts → total < 7s
    let userRow: {
      id: string;
      email: string;
      name: string;
      role: string;
      active: boolean;
      passwordhash: string;
      organizationid: string;
    } | null = null;

    try {
      const result = await queryWithFallback(
        'SELECT id, email, name, role, active, "passwordHash", "organizationId" FROM "User" WHERE email = $1',
        [emailLower]
      );
      if (result.rows.length > 0) {
        const r = result.rows[0] as {
          id: string;
          email: string;
          name: string;
          role: string;
          active: boolean;
          passwordHash: string;
          organizationId: string;
        };
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
    } catch (dbErr) {
      console.error(
        "[auth/login] pg échoué:",
        dbErr instanceof Error ? dbErr.message : "unknown"
      );
      return NextResponse.json(
        {
          ok: false,
          error:
            "Base de données temporairement injoignable. Réessaie dans 30s ou contacte l'administrateur.",
        },
        { status: 503 }
      );
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

    // Crée la session (pose le cookie HTTP-only)
    await createSession({
      sub: userRow.id,
      email: userRow.email,
      name: userRow.name,
      role: userRow.role as never,
      organizationId: userRow.organizationid,
    });

    // Renvoie aussi le token dans le JSON pour le client api-client.ts
    const token = await signSession({
      sub: userRow.id,
      email: userRow.email,
      name: userRow.name,
      role: userRow.role as never,
      organizationId: userRow.organizationid,
    });

    // Audit (best-effort — pas de blocage si DB échoue, et non critique)
    try {
      await queryWithFallback(
        'INSERT INTO "AuditEvent" (id, "createdAt", action, entity, "entityId", details, "userId") VALUES (gen_random_uuid(), NOW(), $1, $2, $3, $4, $5)',
        [
          "login",
          "User",
          userRow.id,
          `Connexion réussie depuis ${request.headers.get("user-agent")?.slice(0, 100) || "unknown"}`,
          userRow.id,
        ]
      );
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
