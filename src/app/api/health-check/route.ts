import { NextResponse } from "next/server";

/**
 * GET /api/health-check
 * Endpoint public de diagnostic pour comprendre la configuration réseau.
 * À appeler dans le navigateur : /api/health-check
 *
 * Retourne :
 *  - L'URL du backend Railway configurée (NEXT_PUBLIC_API_URL)
 *  - Si le backend répond (test fetch server-side, contourne le CORS)
 *  - La latence mesurée
 *  - L'origine autorisée par CORS
 */
export async function GET() {
  const startUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";
  const isProd = process.env.NODE_ENV === "production";
  const isLocalhost =
    startUrl.includes("localhost") ||
    startUrl.includes("127.0.0.1") ||
    (startUrl.startsWith("http://") && !startUrl.includes("localhost"));

  const effectiveApiUrl =
    isProd && isLocalhost ? "" : startUrl.replace(/\/$/, "");

  const result = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    frontendOrigin: "https://yehiortech.com",
    configuredApiUrl: startUrl || "(vide)",
    effectiveApiUrl: effectiveApiUrl || "(vide → routes Next.js)",
    ignoredLocalhost: isProd && isLocalhost,
    backendReachable: false,
    backendLatencyMs: 0,
    backendStatus: 0,
    backendHealth: null as unknown,
    backendError: null as string | null,
    diagnostics: {
      adviceIfBackendUnreachable: [
        "1. Vérifie que Railway a bien démarré le serveur backend (logs Railway).",
        "2. Vérifie que NEXT_PUBLIC_API_URL pointe vers l'URL Railway correcte (pas localhost).",
        "3. Vérifie que DATABASE_URL et JWT_SECRET sont définis côté Railway.",
        "4. Le backend doit répondre GET /api/health avec { ok: true }.",
      ],
    },
  };

  if (effectiveApiUrl) {
    const start = Date.now();
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(`${effectiveApiUrl}/api/health`, {
        signal: ctrl.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(t);
      result.backendReachable = res.ok;
      result.backendStatus = res.status;
      result.backendLatencyMs = Date.now() - start;
      try {
        result.backendHealth = await res.json();
      } catch {
        result.backendError = "Réponse non-JSON du backend";
      }
    } catch (err) {
      result.backendError = err instanceof Error ? err.message : String(err);
      result.backendLatencyMs = Date.now() - start;
    }
  } else {
    result.backendError =
      "Aucun backend Railway configuré (NEXT_PUBLIC_API_URL vide ou localhost). Le frontend utilise les routes Next.js Vercel.";
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}
