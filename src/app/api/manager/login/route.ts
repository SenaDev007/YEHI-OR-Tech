import { NextResponse } from "next/server";
import { managerCookieName, signManagerSession, allowedManagerEmail } from "@/lib/manager-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;
  const configuredEmail = process.env.MANAGER_ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.MANAGER_ADMIN_PASSWORD;

  if (!configuredEmail || !configuredPassword || !process.env.MANAGER_AUTH_SECRET) {
    return NextResponse.json({ error: "La configuration sécurisée du manager n'est pas encore complète." }, { status: 503 });
  }
  if (!email || email !== configuredEmail || password !== configuredPassword || !allowedManagerEmail(email)) {
    return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(managerCookieName, signManagerSession({ email, provider: "password", exp: Date.now() + 1000 * 60 * 60 * 12 }), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12,
  });
  return response;
}
