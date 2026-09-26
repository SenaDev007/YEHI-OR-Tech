import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * POST /api/academia-helm/create-tenant
 *
 * ⭐ Crée une école directement sur Academia Helm depuis Vercel.
 * Plus de dépendance Railway.
 *
 * Appelle POST /platform/tenants/create-manual (endpoint admin officiel).
 * Header x-platform-admin-email requis.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const apiUrl = process.env.ACADEMIA_HELM_API_URL?.replace(/\/$/, "");
  const adminEmail = process.env.ACADEMIA_HELM_ADMIN_EMAIL;

  if (!apiUrl || !adminEmail) {
    return NextResponse.json({
      ok: false,
      error: "ACADEMIA_HELM_API_URL ou ACADEMIA_HELM_ADMIN_EMAIL non configuré sur Vercel.",
    }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiUrl}/platform/tenants/create-manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-platform-admin-email": adminEmail,
        "User-Agent": "YEHI-OR-Tech-Manager/1.0",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      let errText: string;
      try {
        const errJson = await res.json() as { message?: string | string[]; error?: string };
        errText = Array.isArray(errJson.message)
          ? errJson.message.join(", ")
          : (errJson.message || errJson.error || `HTTP ${res.status}`);
      } catch {
        errText = await res.text().catch(() => `HTTP ${res.status}`);
      }
      return NextResponse.json({
        ok: false,
        error: `Academia Helm: ${errText.slice(0, 300)}`,
      }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    return NextResponse.json({
      ok: false,
      error: isAbort
        ? "Academia Helm API timeout (30s). Réessaie."
        : `Academia Helm API injoignable: ${err instanceof Error ? err.message : "unknown"}`,
    }, { status: 502 });
  }
}
