import { NextResponse } from "next/server";

/**
 * GET /api/test-backend
 *
 * Endpoint PUBLIC (pas d'auth) qui fait un fetch SERVER-SIDE depuis Vercel
 * vers le backend Railway. Comme c'est serveur → serveur, il n'y a PAS de
 * CORS impliqué. Ça permet de diagnostiquer :
 *
 *  - Si le backend est déployé et répond (DNS + connectivité OK)
 *  - Si le SSL est OK
 *  - Si le backend écoute bien sur le port Railway
 *
 * Si CET endpoint fonctionne mais que le frontend (client-side) échoue →
 * c'est un problème CORS (le backend n'autorise pas l'origine du navigateur).
 *
 * Si CET endpoint échoue aussi → problème DNS / backend down / SSL.
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

  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(healthUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    });
    clearTimeout(timeout);

    const elapsedMs = Date.now() - startTime;

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return NextResponse.json({
        ok: false,
        stage: "http-status",
        error: `Backend répond HTTP ${res.status} sur ${healthUrl}`,
        httpStatus: res.status,
        body: body.slice(0, 500),
        elapsedMs,
        advice: "Le backend répond mais avec un code d'erreur. Vérifie les logs Railway.",
      });
    }

    let bodyJson: unknown = null;
    try {
      bodyJson = await res.json();
    } catch {
      // Pas grave si pas JSON
    }

    return NextResponse.json({
      ok: true,
      stage: "server-side-ok",
      message: `✅ Backend Railway répond depuis Vercel (server-side) en ${elapsedMs}ms`,
      backendUrl,
      healthEndpoint: healthUrl,
      httpStatus: res.status,
      body: bodyJson,
      elapsedMs,
      // ⭐ IMPORTANT : si ce test server-side fonctionne mais le client échoue,
      // c'est un problème CORS (backend n'autorise pas l'origine du navigateur)
      corsDiagnostic:
        "Si tu vois cette réponse OK mais que le navigateur (client-side) échoue à joindre le backend, " +
        "c'est un problème CORS. Le backend doit autoriser l'origine du navigateur (Frontend URL).",
      nextStep:
        "Maintenant teste depuis le navigateur : ouvre la console (F12) → Network → va sur /manager/login → essaie de te connecter → regarde l'erreur réseau pour voir si c'est CORS.",
    });
  } catch (err) {
    const elapsedMs = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    const isAbort = err instanceof DOMException && err.name === "AbortError";

    // Diagnostic fin
    let stage = "unknown";
    let advice = "";
    if (isAbort) {
      stage = "timeout";
      advice = `Le backend n'a pas répondu en 15s. Backend probablement down ou surchargé.`;
    } else if (errMsg.includes("ENOTFOUND") || errMsg.includes("getaddrinfo")) {
      stage = "dns";
      advice = `DNS : ${backendUrl} ne résout pas. Vérifie que le domaine backend.yehiortech.com est bien configuré (CNAME vers Railway) et propagé.`;
    } else if (errMsg.includes("ECONNREFUSED")) {
      stage = "connection-refused";
      advice = `Connexion refusée. Le backend Railway n'écoute pas sur le port attendu.`;
    } else if (errMsg.includes("certificate") || errMsg.includes("SSL") || errMsg.includes("UNABLE_TO_VERIFY")) {
      stage = "ssl";
      advice = `Problème SSL/TLS sur ${backendUrl}. Vérifie le certificat du domaine.`;
    } else if (errMsg.includes("fetch failed")) {
      stage = "network";
      advice = `Fetch failed — backend injoignable. Causes possibles : backend down, DNS, SSL, ou domaine non configuré.`;
    }

    return NextResponse.json({
      ok: false,
      stage,
      error: errMsg,
      backendUrl,
      healthEndpoint: healthUrl,
      elapsedMs,
      advice,
      // Test manuel : l'utilisateur peut ouvrir l'URL directement
      manualTest: `Ouvre ${healthUrl} directement dans ton navigateur. Si ça marche → DNS/SSL OK. Si ça ne marche pas → DNS ou backend down.`,
    });
  }
}
