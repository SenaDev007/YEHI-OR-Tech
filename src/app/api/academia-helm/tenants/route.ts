import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * GET /api/academia-helm/tenants
 *
 * ⭐ REFACTOR COMPLET — utilise le MÊME PATTERN que le site public Academia Helm.
 *
 * Academia Helm expose un endpoint PUBLIC (sans authentification) :
 *   GET /api/public/schools/list
 *
 * Ce endpoint est décoré @Public dans le NestJS controller → aucun header
 * d'auth requis. C'est exactement ce qu'utilise le site public Academia Helm
 * pour afficher la liste des écoles sur sa page d'accueil.
 *
 * Avantages :
 * ✅ Pas besoin de ACADEMIA_HELM_ADMIN_EMAIL (endpoint public)
 * ✅ Pas de CORS (même origine Vercel)
 * ✅ Pas de dépendance Railway
 * ✅ Cache 60s côté Academia Helm (Redis)
 * ✅ Cold start Neon géré gracieusement (retourne liste vide au lieu d'erreur)
 *
 * Env vars requises sur Vercel :
 * - ACADEMIA_HELM_API_URL : URL de l'API Academia Helm
 *   (ex: https://api.academiahelm.com ou https://academiahelm.com)
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Auth requise côté YEHI OR Tech (le manager est protégé)
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  const apiUrl = process.env.ACADEMIA_HELM_API_URL?.replace(/\/$/, "");

  if (!apiUrl) {
    return NextResponse.json({
      ok: false,
      error: "ACADEMIA_HELM_API_URL non configuré sur Vercel. Va dans Settings > Environment Variables et ajoute ACADEMIA_HELM_API_URL (ex: https://academiahelm.com ou https://api.academiahelm.com).",
    }, { status: 500 });
  }

  // ⭐ Construit l'URL du endpoint public (même logique que le web-app Academia Helm)
  const schoolsUrl = apiUrl.endsWith("/api")
    ? `${apiUrl}/public/schools/list`
    : `${apiUrl}/api/public/schools/list`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(schoolsUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "YEHI-OR-Tech-Manager/1.0",
      },
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

    // ⭐ L'endpoint public renvoie un ARRAY direct (pas wrappé dans { tenants: [] })
    const data = await res.json();

    // Normalise en objet { ok, data, total } pour le frontend
    const schools = Array.isArray(data) ? data : (data.schools || data.tenants || []);

    return NextResponse.json({
      ok: true,
      data: schools,
      total: schools.length,
    }, {
      headers: {
        // Cache navigateur 60s
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";

    // ⭐ Même pattern que Academia Helm : si timeout, retourne liste vide (200)
    // au lieu d'une erreur → l'UI affiche "Réessayer" au lieu d'un spinner infini
    if (isAbort) {
      console.warn("[academia-helm/tenants] Timeout 15s — retourne liste vide");
      return NextResponse.json({
        ok: true,
        data: [],
        total: 0,
        warning: "Délai dépassé — l'API Academia Helm met trop de temps à répondre (cold start possible). Clique sur Rafraîchir pour réessayer.",
      });
    }

    return NextResponse.json({
      ok: false,
      error: `Academia Helm API injoignable: ${err instanceof Error ? err.message : "unknown"}. Vérifie que ACADEMIA_HELM_API_URL=${apiUrl} est correct et que l'API est accessible.`,
    }, { status: 502 });
  }
}
