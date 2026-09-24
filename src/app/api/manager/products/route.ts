import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * GET /api/manager/products
 * Liste tous les services/produits de l'organisation.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const products = await prisma.productService.findMany({
    where: {
      organizationId: session.organizationId,
      active: true,
    },
    orderBy: [{ profitCenter: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ ok: true, data: products });
}
