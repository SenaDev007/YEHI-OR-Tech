import { NextResponse } from "next/server";

/**
 * GET /api/test-backend
 *
 * Endpoint PUBLIC (pas d'auth) qui fait un fetch SERVER-SIDE depuis Vercel
 * vers le backend Railway. Comme c'est serveur → serveur, il n'y a PAS de
 * CORS impliqué.
 *
 * Teste DEUX URLs :
 *  1. Le domaine personnalisé (backend.yehiortech.com) — passe par Cloudflare
 *  2. L'URL Railway directe (xxx.up.railway.app) — bypass Cloudflare
 *
 * Ça permet de distinguer :
 *  - Si test 1 KO + test 2 OK → problème Cloudflare (SSL mode, proxy, etc.)
 *  - Si les deux KO → backend Railway down
 *  - Si les deux OK → problème CORS côté navigateur
 */
export async function GET() {
  const startTime = Date.now();
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

  if (!configuredApiUrl) {
    return NextResponse.json({
      ok: false,
      stage: "config",
      error: "NEXT_PUBLIC_API_URL n'est pas configuré sur Vercel (ou build pas à jour).",
      advice: "Vérifie Settings > Environment Variables sur Vercel, puis Redeploy.",
    });
  }

  const backendUrl = configuredApiUrl.replace(/\/$/, "");
  const healthUrl = `${backendUrl}/api/health`;

  // Test 1 : via le domaine personnalisé (passe par Cloudflare si proxy activé)
  const test1 = await testFetch(healthUrl, "via domaine personnalisé (Cloudflare)");

  // Test 2 : URL Railway directe (bypass Cloudflare) — détectée via header X-Railway-Route
  // ou on laisse l'utilisateur configurer BACKEND_DIRECT_URL sur Vercel
  const directUrl = process.env.BACKEND_DIRECT_URL?.trim() || "";
  const test2: Awaited<ReturnType<typeof testFetch>> | { skipped: true; reason: string } = directUrl
    ? await testFetch(`${directUrl.replace(/\/$/, "")}/api/health`, "via URL Railway directe (bypass Cloudflare)")
    : { skipped: true, reason: "BACKEND_DIRECT_URL non configuré sur Vercel — configure-le avec l'URL xxx.up.railway.app pour bypass Cloudflare" };

  // Diagnostic final
  const test1Ok = test1.ok === true;
  const test2Skipped = "skipped" in test2 && test2.skipped === true;
  const test2Ok = !test2Skipped && "ok" in test2 && test2.ok === true;

  let diagnosis = "Indéterminé — configure BACKEND_DIRECT_URL pour un diagnostic complet.";
  let action = "";

  if (!test1Ok && !test2Ok && !test2Skipped) {
    diagnosis = "❌ Backend Railway DOWN — ni Cloudflare ni l'URL directe ne fonctionnent.";
    action = "Vérifie le service Railway : status, logs, redémarre si nécessaire.";
  } else if (!test1Ok && test2Ok) {
    diagnosis = "⚠️ Cloudflare bloque/proxy mal configuré — l'URL directe Railway marche mais pas le domaine personnalisé.";
    action = "Sur Cloudflare > backend.yehiortech.com > SSL/TLS : passe en mode 'Full' (pas Flexible). Désactive le proxy Cloudflare (gray cloud) pour tester.";
  } else if (test1Ok && test2Ok) {
    diagnosis = "✅ Backend accessible depuis Vercel — si le navigateur (client-side) échoue, c'est un problème CORS (frontend URL non autorisée côté backend).";
    action = "Sur Railway backend, vérifie que FRONTEND_URL=https://yehiortech.com est configuré.";
  } else if (test1Ok && !test2Ok && !test2Skipped) {
    diagnosis = "Bizarre — domaine Cloudflare OK mais URL Railway directe KO. Probablement Cloudflare qui met en cache une vieille réponse OK.";
    action = "Vide le cache Cloudflare (Caching > Purge Everything).";
  } else if (test1Ok && test2Skipped) {
    diagnosis = "✅ Backend accessible via Cloudflare depuis Vercel. Pour confirmer que le navigateur (client-side) peut aussi y accéder, vérifie CORS côté Railway (FRONTEND_URL).";
    action = "Si le navigateur échoue → problème CORS. Vérifie FRONTEND_URL sur Railway backend = https://yehiortech.com";
  }

  return NextResponse.json({
    ok: test1Ok,
    stage: "complete",
    backendUrl,
    elapsedMs: Date.now() - startTime,
    tests: {
      test1, // via Cloudflare / domaine personnalisé
      test2, // via Railway directe (bypass Cloudflare)
    },
    diagnosis,
    action,
    // Conseil config additionnelle
    configHint: "Pour un diagnostic complet, configure aussi BACKEND_DIRECT_URL sur Vercel (URL Railway directe type xxx.up.railway.app).",
  });
}

async function testFetch(url: string, label: string) {
  const start = Date.now();
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    });
    clearTimeout(timeout);

    const elapsedMs = Date.now() - start;

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        label,
        url,
        httpStatus: res.status,
        body: body.slice(0, 500),
        elapsedMs,
        // Diagnostic fin pour les codes courants
        diagnosis:
          res.status === 502 ? "502 Bad Gateway — Cloudflare n'arrive pas à joindre le backend Railway. Backend probablement down ou en cours de redéploiement."
          : res.status === 521 ? "521 Web Server Down — Cloudflare ne peut pas joindre l'origine. Backend Railway éteint ou injoignable."
          : res.status === 522 ? "522 Connection Timed Out — Cloudflare n'arrive pas à joindre Railway (TCP timeout)."
          : res.status === 523 ? "523 Origin Unreachable — Railway injoignable."
          : res.status === 525 ? "525 SSL Handshake Failed — SSL entre Cloudflare et Railway en panne."
          : `HTTP ${res.status} — voir le body pour détails.`,
      };
    }

    let bodyJson: unknown = null;
    try {
      bodyJson = await res.json();
    } catch {}

    return {
      ok: true,
      label,
      url,
      httpStatus: res.status,
      body: bodyJson,
      elapsedMs,
    };
  } catch (err) {
    const elapsedMs = Date.now() - start;
    const errMsg = err instanceof Error ? err.message : String(err);
    const isAbort = err instanceof DOMException && err.name === "AbortError";

    let stage = "unknown";
    if (isAbort) stage = "timeout";
    else if (errMsg.includes("ENOTFOUND") || errMsg.includes("getaddrinfo")) stage = "dns";
    else if (errMsg.includes("ECONNREFUSED")) stage = "connection-refused";
    else if (errMsg.includes("certificate") || errMsg.includes("SSL") || errMsg.includes("UNABLE_TO_VERIFY")) stage = "ssl";
    else if (errMsg.includes("fetch failed")) stage = "network";

    return {
      ok: false,
      label,
      url,
      error: errMsg,
      stage,
      elapsedMs,
    };
  }
}
