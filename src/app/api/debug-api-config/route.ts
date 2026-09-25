import { NextResponse } from "next/server";

/**
 * GET /api/debug-api-config
 * Endpoint public de diagnostic — aide à comprendre pourquoi le frontend
 * n'arrive pas à joindre le backend Railway.
 *
 * Retourne :
 *  - configuredApiUrl : la valeur NEXT_PUBLIC_API_URL lue au build
 *  - effectiveApiUrl : l'URL effectivement utilisée par api-client
 *  - isLocalhost : si l'URL est en localhost (mixed content blocking en prod)
 *  - isHttpsUrl : si l'URL est en HTTPS (requis en prod)
 *  - currentOrigin : l'origine du navigateur qui appelle (pour vérifier CORS)
 *  - testEndpoints : URLs que l'utilisateur peut ouvrir pour tester manuellement
 *
 * ⚠️ Ce endpoint est PUBLIC (pas d'auth) — c'est volontaire pour le debug.
 */
export async function GET() {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";
  const isProd = process.env.NODE_ENV === "production";
  const isLocalhost =
    configuredApiUrl.includes("localhost") ||
    configuredApiUrl.includes("127.0.0.1") ||
    (configuredApiUrl.startsWith("http://") && !configuredApiUrl.includes("localhost"));

  const effectiveApiUrl =
    isProd && isLocalhost ? "" : configuredApiUrl.replace(/\/$/, "");

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      // ⭐ Ce que l'api-client utilise réellement
      configuredApiUrl: configuredApiUrl || "(vide)",
      effectiveApiUrl: effectiveApiUrl || "(vide → routes Next.js Vercel)",
      ignoredLocalhost: isProd && isLocalhost,
      // ⚠️ Build info : NEXT_PUBLIC_* vars sont INLINÉES au build time
      // Si tu viens de set la variable, tu DOIS redeployer pour qu'elle soit prise en compte
      buildInfo: {
        warning: "NEXT_PUBLIC_API_URL est lu au BUILD TIME. Si tu viens de l'ajouter/modifier sur Vercel, tu DOIS redeployer pour qu'elle soit intégrée.",
        checkNeeded: "Si configuredApiUrl est '(vide)' ici, ça veut dire que le build n'a pas vu la variable.",
      },
      // CORS check : l'origine doit être autorisée par le backend
      currentOriginHint: "Pour vérifier CORS, ouvre ton backend dans le navigateur et regarde les headers Access-Control-Allow-Origin.",
      // Endpoints à tester manuellement
      testEndpoints: {
        // 1. Test que le backend répond
        backendHealth: effectiveApiUrl ? `${effectiveApiUrl}/api/health` : "(no backend configured)",
        // 2. Test que la route des tenants existe sur le backend (sans auth → 401 si OK, 404 si route inexistante)
        backendTenantsRoute: effectiveApiUrl ? `${effectiveApiUrl}/api/content/saas-apps` : "(no backend configured)",
        // 3. Test que le backend CORS autorise cette origine
        corsCheck: "Ouvre la console navigateur (F12 → Network) et regarde si la requête OPTIONS préflight est 200.",
      },
      // Diagnostic rapide
      diagnostics: {
        nextPublicApiUrlSet: !!configuredApiUrl,
        nextPublicApiUrlIsValid: !!effectiveApiUrl,
        nextPublicApiUrlIsHttps: effectiveApiUrl.startsWith("https://"),
        willFallbackToVercelRoutes: !effectiveApiUrl,
        // Si ces conditions sont vraies, le SaaS Hub peut fonctionner
        saasHubCanWork:
          !!effectiveApiUrl &&
          effectiveApiUrl.startsWith("https://") &&
          !isLocalhost,
      },
      // Conseils
      adviceIfEmpty: [
        "1. Vérifie que NEXT_PUBLIC_API_URL est bien défini dans Vercel > Settings > Environment Variables",
        "2. IMPORTANT : après avoir ajouté la variable, tu DOIS cliquer sur 'Redeploy' dans Vercel",
        "   (Les variables NEXT_PUBLIC_* sont intégrées au BUILD, pas lues au runtime)",
        "3. Vérifie que la valeur est bien https://backend.yehiortech.com (avec https://, sans slash final)",
      ],
      adviceIfSetButNotWorking: [
        `1. Ouvre ${effectiveApiUrl}/api/health dans ton navigateur → doit retourner { ok: true, status: 'operational' }`,
        `2. Si ça répond pas : le backend Railway est down. Vérifie les logs Railway.`,
        `3. Si ça répond : c'est un problème CORS.`,
        `   - Ovre F12 > Network dans le navigateur`,
        `   - Va sur /manager/saas-hub, regarde la requête échouée`,
        `   - Doit avoir une erreur CORS dans la console`,
        `4. Sur Railway backend, vérifie que FRONTEND_URL=https://yehiortech.com est configuré`,
        `5. Vérifie que ACADEMIA_HELM_API_URL et ACADEMIA_HELM_ADMIN_EMAIL sont set sur Railway backend`,
      ],
    },
    {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    }
  );
}
