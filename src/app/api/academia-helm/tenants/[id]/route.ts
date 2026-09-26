import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * GET /api/academia-helm/tenants/[id] — Détail d'une école (360°)
 * PATCH /api/academia-helm/tenants/[id] — Modifier (plan, status, bilingual, expiration, etc.)
 *
 * Proxy vers l'API Academia Helm :
 *   GET  /platform/tenants/:id → détail 360° (promoteur, élèves, staff, finances)
 *   PATCH /platform/tenants/:id → modifier (plan, planStatus, billingCycle, expiration, trialEnd, bilingualEnabled, bilingualExpiresAt)
 *   PATCH /platform/tenants/:id/status → suspendre/réactiver
 *
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

  // L'API Academia Helm n'a pas de GET /platform/tenants/:id dédié
  // On utilise la liste (qui contient déjà toutes les infos) et on filtre par ID
  const listUrl = apiUrl.endsWith("/api")
    ? `${apiUrl}/platform/tenants?limit=100`
    : `${apiUrl}/api/platform/tenants?limit=100`;

  try {
    const res = await fetch(listUrl, {
      headers: { Accept: "application/json", "x-platform-admin-email": adminEmail },
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.text().catch(() => `HTTP ${res.status}`);
      return NextResponse.json({ ok: false, error: `Academia Helm (${res.status}): ${err.slice(0, 200)}` }, { status: 502 });
    }
    const data = await res.json() as { tenants?: unknown[] };
    const tenants = data.tenants || [];
    const tenant = tenants.find((t: any) => t.id === id);
    if (!tenant) return NextResponse.json({ ok: false, error: "École introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true, data: tenant });
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

  // Si body = { status: "..." } uniquement → route /status (suspendre/réactiver)
  // Sinon → route / (modifier plan, expiration, bilingual, etc.)
  const isStatusOnly = body.status !== undefined && Object.keys(body).length === 1;
  const base = apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;
  const url = isStatusOnly
    ? `${base}/platform/tenants/${id}/status`
    : `${base}/platform/tenants/${id}`;

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
