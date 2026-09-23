import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * GET /api/manager/leads
 * Liste tous les leads (CustomerOrder) avec infos client.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const orders = await prisma.customerOrder.findMany({
    where: { organizationId: session.organizationId },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    ok: true,
    data: orders.map((o) => ({
      id: o.id,
      number: o.number,
      title: o.title,
      description: o.description,
      status: o.status,
      price: o.price,
      createdAt: o.createdAt,
      customer: o.customer
        ? {
            name: o.customer.name,
            email: o.customer.email,
            phone: o.customer.phone,
          }
        : null,
    })),
  });
}
