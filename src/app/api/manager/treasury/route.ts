import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * GET /api/manager/treasury
 * Liste les enveloppes de trésorerie avec soldes.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const envelopes = await prisma.treasuryEnvelope.findMany({
    where: { organizationId: session.organizationId },
    orderBy: [{ isOperational: "desc" }, { name: "asc" }],
  });

  return NextResponse.json({ ok: true, data: envelopes });
}
