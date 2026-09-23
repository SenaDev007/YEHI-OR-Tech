import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { destroySession, getSession } from "@/lib/auth";

/**
 * POST /api/auth/logout
 * Détruit la session courante.
 */
export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      await prisma.auditEvent.create({
        data: {
          action: "logout",
          entity: "User",
          entityId: session.sub,
          userId: session.sub,
        },
      });
    }
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[auth/logout] Erreur:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
