import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * GET /api/academia-helm/tenants/[id] — Détail d'une école
 * PATCH /api/academia-helm/tenants/[id] — Modifier (plan, expiration, etc.)
 * PATCH /api/academia-helm/tenants/[id]/status — Suspendre/Réactiver
 *
 * Proxy vers l'API Academia Helm (endpoint privé /platform/tenants/:id).
 * Header x-platform-admin-email requis.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const apiUrl = process.env.ACADEMIA_HELM_API_URL?.replace(/\/$/, "");
  const adminEmail = process.env.ACADEMIA_HELM_ADMIN_EMAIL;

  if (!apiUrl || !adminEmail) {
    return NextResponse.json({ ok: false, error: "ACADEMIA_HELM_API_URL ou ADMIN_EMAIL non configuré sur Vercel" }, { status: 500 });
  }

  const url = apiUrl.endsWith("/api") ? `${apiUrl}/platform/tenants/${id}` : `${apiUrl}/api/platform/tenants/${id}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "x-platform-admin-email": adminEmail },
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.text().catch(() => `HTTP ${res.status}`);
      return NextResponse.json({ ok: false, error: `Academia Helm (${res.status}): ${err.slice(0, 200)}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Erreur" }, { status: 502 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const apiUrl = process.env.ACADEMIA_HELM_API_URL?.replace(/\/$/, "");
  const adminEmail = process.env.ACADEMIA_HELM_ADMIN_EMAIL;

  if (!apiUrl || !adminEmail) {
    return NextResponse.json({ ok: false, error: "ACADEMIA_HELM_API_URL ou ADMIN_EMAIL non configuré" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 }); }

  // Détermine l'endpoint : si body a { status: "..." } → /status, sinon → /
  const isStatusUpdate = body.status !== undefined && Object.keys(body).length === 1;
  const endpoint = isStatusUpdate
    ? `${apiUrl.endsWith("/api") ? "" : "/api"}/platform/tenants/${id}/status`
    : `${apiUrl.endsWith("/api") ? "" : "/api"}/platform/tenants/${id}`;
  const url = `${apiUrl}${endpoint}`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json", "x-platform-admin-email": adminEmail },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => `HTTP ${res.status}`);
      return NextResponse.json({ ok: false, error: `Academia Helm (${res.status}): ${err.slice(0, 200)}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Erreur" }, { status: 502 });
  }
}
