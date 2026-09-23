import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * GET /api/manager/academia
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const subscriptions = await prisma.academiaSubscription.findMany({
    where: { organizationId: session.organizationId },
    include: { customer: true },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json({ ok: true, data: subscriptions });
}
