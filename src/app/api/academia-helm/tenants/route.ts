import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * GET /api/academia-helm/tenants
 *
 * ⭐ Utilise l'endpoint PRIVÉ /platform/tenants qui contient TOUTES les infos :
 *   - plan (SEED/GROW/LEAD/NETWORK)
 *   - status (ACTIVE/TRIAL/SUSPENDED)
 *   - students (nombre d'élèves)
 *   - daysRemaining (jours avant échéance)
 *   - bilingualEnabled
 *   - studentEnrollmentBlocked
 *   - expiration, trialEnd
 *
 * Header requis : x-platform-admin-email
 * Env vars Vercel :
 *   - ACADEMIA_HELM_API_URL (obligatoire)
 *   - ACADEMIA_HELM_ADMIN_EMAIL (obligatoire pour cet endpoint privé)
 *
 * Si ACADEMIA_HELM_ADMIN_EMAIL n'est pas configuré, fallback sur l'endpoint
 * PUBLIC /api/public/schools/list (infos limitées mais toujours dispo).
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const apiUrl = process.env.ACADEMIA_HELM_API_URL?.replace(/\/$/, "");
  const adminEmail = process.env.ACADEMIA_HELM_ADMIN_EMAIL;

  if (!apiUrl) {
    return NextResponse.json({
      ok: false,
      error: "ACADEMIA_HELM_API_URL non configuré sur Vercel.",
    }, { status: 500 });
  }

  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "100";
  const search = req.nextUrl.searchParams.get("search");
  const status = req.nextUrl.searchParams.get("status");

  // ⭐ PRIO 1 : endpoint PRIVÉ (toutes les infos : plan, students, status, etc.)
  if (adminEmail) {
    try {
      const url = new URL(`${apiUrl}/platform/tenants`);
      url.searchParams.set("page", page);
      url.searchParams.set("limit", limit);
      if (search) url.searchParams.set("search", search);
      if (status) url.searchParams.set("status", status);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-platform-admin-email": adminEmail,
          "User-Agent": "YEHI-OR-Tech-Manager/1.0",
        },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json() as { tenants?: unknown[]; total?: number };
        return NextResponse.json({
          ok: true,
          data: data.tenants || [],
          total: data.total || 0,
          source: "private",
        }, {
          headers: { "Cache-Control": "no-store" },
        });
      }
      // Si 403/401 → admin email invalide, on tente le fallback public
      console.warn(`[academia-helm/tenants] Private endpoint returned ${res.status}, falling back to public`);
    } catch (err) {
      console.warn("[academia-helm/tenants] Private endpoint failed, trying public:", err instanceof Error ? err.message : "unknown");
    }
  }

  // ⭐ FALLBACK : endpoint PUBLIC (infos limitées, pas d'auth)
  const schoolsUrl = apiUrl.endsWith("/api")
    ? `${apiUrl}/public/schools/list`
    : `${apiUrl}/api/public/schools/list`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(schoolsUrl, {
      method: "GET",
      headers: { Accept: "application/json", "User-Agent": "YEHI-OR-Tech-Manager/1.0" },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => `HTTP ${res.status}`);
      return NextResponse.json({
        ok: false,
        error: `Academia Helm API (${res.status}): ${errText.slice(0, 300)}`,
      }, { status: 502 });
    }

    const data = await res.json();
    const schools = Array.isArray(data) ? data : (data.schools || data.tenants || []);

    return NextResponse.json({
      ok: true,
      data: schools,
      total: schools.length,
      source: "public",
      warning: adminEmail
        ? "Endpoint privé indisponible — affichage en mode dégradé (infos limitées)."
        : "ACADEMIA_HELM_ADMIN_EMAIL non configuré — affichage limité. Ajoute-le sur Vercel pour voir les plans, statuts, élèves.",
    });
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    if (isAbort) {
      return NextResponse.json({
        ok: true, data: [], total: 0,
        warning: "Délai dépassé — clique sur Rafraîchir.",
      });
    }
    return NextResponse.json({
      ok: false,
      error: `Academia Helm injoignable: ${err instanceof Error ? err.message : "unknown"}`,
    }, { status: 502 });
  }
}
