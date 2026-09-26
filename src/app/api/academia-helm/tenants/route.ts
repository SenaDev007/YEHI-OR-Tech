import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * GET /api/academia-helm/tenants
 *
 * ⭐ REFACTOR COMPLET : appelle DIRECTEMENT l'API Academia Helm depuis Vercel.
 * Plus de dépendance Railway pour le SaaS Hub.
 *
 * Utilise les variables d'env Vercel (server-side, pas NEXT_PUBLIC_) :
 * - ACADEMIA_HELM_API_URL : URL de l'API Academia Helm
 * - ACADEMIA_HELM_ADMIN_EMAIL : email admin plateforme
 *
 * L'API Academia Helm expose GET /platform/tenants qui renvoie la liste
 * paginée des écoles avec plan, statut, dates d'échéance, etc.
 */
export async function GET(req: NextRequest) {
  // Auth requise
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const apiUrl = process.env.ACADEMIA_HELM_API_URL?.replace(/\/$/, "");
  const adminEmail = process.env.ACADEMIA_HELM_ADMIN_EMAIL;

  if (!apiUrl) {
    return NextResponse.json({
      ok: false,
      error: "ACADEMIA_HELM_API_URL non configuré sur Vercel. Ajoute cette variable dans Settings > Environment Variables.",
    }, { status: 500 });
  }
  if (!adminEmail) {
    return NextResponse.json({
      ok: false,
      error: "ACADEMIA_HELM_ADMIN_EMAIL non configuré sur Vercel.",
    }, { status: 500 });
  }

  // Passe les query params
  const url = new URL(`${apiUrl}/platform/tenants`);
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const search = req.nextUrl.searchParams.get("search");
  const status = req.nextUrl.searchParams.get("status");
  url.searchParams.set("page", page);
  url.searchParams.set("limit", limit);
  if (search) url.searchParams.set("search", search);
  if (status) url.searchParams.set("status", status);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-platform-admin-email": adminEmail,
        "User-Agent": "YEHI-OR-Tech-Manager/1.0",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => `HTTP ${res.status}`);
      return NextResponse.json({
        ok: false,
        error: `Academia Helm API (${res.status}): ${errText.slice(0, 300)}`,
      }, { status: 502 });
    }

    const data = await res.json() as {
      tenants?: unknown[];
      total?: number;
      page?: number;
      limit?: number;
    };

    return NextResponse.json({
      ok: true,
      data: data.tenants || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 50,
    });
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    return NextResponse.json({
      ok: false,
      error: isAbort
        ? "Academia Helm API timeout (15s). L'API est peut-être down ou en cold start."
        : `Academia Helm API injoignable: ${err instanceof Error ? err.message : "unknown"}`,
    }, { status: 502 });
  }
}
