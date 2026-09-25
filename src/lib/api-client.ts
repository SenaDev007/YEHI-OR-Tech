/**
 * Client API pour le back-office YEHI OR Manager.
 *
 * Comportement :
 *  - Si NEXT_PUBLIC_API_URL pointe vers le backend Railway (https://...) → l'utilise
 *  - Si NEXT_PUBLIC_API_URL pointe vers localhost ou http:// → l'ignore (mixed content)
 *    et utilise les routes Next.js sur la même origine
 *  - Si NEXT_PUBLIC_API_URL est vide → utilise les routes Next.js sur la même origine
 *
 * Toutes les requêtes ont :
 *  - Un timeout de 10s (évite les chargements éternels)
 *  - Un cache en mémoire de 60s pour les GET (accélère les navigations)
 *  - Une réessaye automatique sur erreur réseau (1 seule fois)
 *  - Si API_URL est injoignable → fallback automatique vers la même origine
 *  - L'envoi automatique du token JWT en Authorization Bearer
 */

// Détection d'environnement
const isProd = process.env.NODE_ENV === "production";

// URL de base du backend Railway. Si vide ou localhost → utilise même origine.
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

// En production, on ignore les URLs localhost (mixed content blocking)
const isLocalhostUrl =
  RAW_API_URL.includes("localhost") ||
  RAW_API_URL.includes("127.0.0.1") ||
  RAW_API_URL.startsWith("http://") && !RAW_API_URL.includes("localhost");

const API_URL =
  isProd && isLocalhostUrl
    ? "" // ignore localhost/http:// en prod → utilise même origine
    : RAW_API_URL.replace(/\/$/, "");

// Comportement réseau
const TIMEOUT_MS = 10_000; // 10s max par défaut
const CACHE_TTL = 60_000; // 60s pour les GET
const MAX_RETRIES = 1; // 1 retry sur erreur réseau

// Timeout plus généreux pour certaines routes lentes mais one-time
const SLOW_ROUTES: Record<string, number> = {
  "/api/auth/login": 25_000, // login : vérif bcrypt + DB → peut prendre 10-20s sur Vercel
  "/api/auth/forgot-password": 25_000, // peut envoyer un email
  "/api/auth/reset-password": 25_000,
};

function getTimeoutFor(path: string): number {
  return SLOW_ROUTES[path] ?? TIMEOUT_MS;
}

// ============================================================
// CACHE MÉMOIRE (par chemin)
// ============================================================
type CacheEntry = { data: unknown; expires: number };
const cache = new Map<string, CacheEntry>();

export function invalidateCache(path?: string) {
  if (path) cache.delete(path);
  else cache.clear();
}

// ============================================================
// GESTION DU COOKIE JWT
// ============================================================
const SESSION_COOKIE = "yehi_manager_session";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/yehi_manager_session=([^;]+)/);
  return match ? match[1] : null;
}

export function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7; // 7 jours
  const secure =
    process.env.NODE_ENV === "production" ||
    (typeof window !== "undefined" && window.location.protocol === "https:");
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function clearTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

// ============================================================
// ERREUR TYPÉE
// ============================================================
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ============================================================
// FETCH AVEC TIMEOUT + RETRY
// ============================================================
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithRetry(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetchWithTimeout(url, options, timeoutMs);
    } catch (err) {
      lastErr = err;
      // Ne pas réessayer sur abort (timeout) — c'est déjà trop long
      if (err instanceof DOMException && err.name === "AbortError") break;
      // Sinon, attendre 200ms puis retry
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }
  throw lastErr;
}

// ============================================================
// FETCH PUBLIC (avec auth Bearer auto)
// ⚠️ NOUVEAU COMPORTEMENT : si API_URL est set, on l'utilise SANS fallback.
// Si le backend est injoignable, on lève une erreur explicite (plus de
// fallback silencieux vers Vercel qui retournait un 501 trompeur).
// ============================================================
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const method = (options.method || "GET").toUpperCase();
  const useCache = method === "GET";
  const timeoutMs = getTimeoutFor(path);

  // Pour les GET, vérifier le cache avant d'envoyer la requête
  if (useCache) {
    const hit = cache.get(path);
    if (hit && hit.expires > Date.now()) {
      const blob = new Blob([JSON.stringify(hit.data)], { type: "application/json" });
      return new Response(blob, { status: 200, headers: { "Content-Type": "application/json" } });
    }
  }

  // Construit l'URL finale : backend Railway si API_URL set, sinon same-origin Vercel
  const baseUrl = API_URL;
  const targetUrl = `${baseUrl}${path}`;

  try {
    const res = await fetchWithRetry(targetUrl, { ...options, headers, method }, timeoutMs);
    // Mettre en cache les GET 2xx réussis
    if (useCache && res.ok) {
      try {
        const cloned = res.clone();
        const data = await cloned.json();
        cache.set(path, { data, expires: Date.now() + CACHE_TTL });
      } catch {
        // Cache best-effort
      }
    }
    return res;
  } catch (err) {
    // Distinguer les cas d'erreur pour donner un message utile à l'utilisateur
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        `Le serveur met trop de temps à répondre (timeout ${Math.round(timeoutMs / 1000)}s). Réessaie.`,
        408
      );
    }

    // Erreur réseau : DNS / CORS / connexion refusée / SSL
    if (baseUrl) {
      // ⚠️ Message d'erreur TRÈS explicite — aide à diagnostiquer
      throw new ApiError(
        `Backend Railway (${baseUrl}) injoignable pour ${path}. ` +
          `Causes possibles : DNS/CORS backend non configuré, backend down, ou build Vercel pas à jour avec NEXT_PUBLIC_API_URL. ` +
          `Vérifie : 1) que ${baseUrl} répond (ouvre-le dans le navigateur), 2) que CORS autorise ${typeof window !== "undefined" ? window.location.origin : "cette origine"}, 3) redeploie Vercel après avoir ajouté NEXT_PUBLIC_API_URL.`,
        0
      );
    }

    // Pas de baseUrl — fallback same-origin
    throw new ApiError(
      `Impossible de joindre le serveur (route: ${path}). ` +
        `Si tu as configuré NEXT_PUBLIC_API_URL, vérifie qu'il est bien défini sur Vercel et qu'un nouveau build est déployé.`,
      0
    );
  }
}

// ============================================================
// API JSON (raccourci : parse + gestion d'erreur)
// ============================================================
export async function apiJson<T = { ok: boolean; [key: string]: unknown }>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res: Response;
  try {
    res = await apiFetch(path, options);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      const t = getTimeoutFor(path);
      throw new ApiError(`Le serveur met trop de temps à répondre (timeout ${Math.round(t / 1000)}s). Réessaie.`, 408);
    }
    throw new ApiError("Impossible de joindre le serveur. Vérifie ta connexion internet.", 0);
  }

  let data: { ok?: boolean; error?: string; token?: string; [k: string]: unknown };
  try {
    data = await res.json();
  } catch {
    throw new ApiError("Réponse invalide du serveur (JSON non parsable).", res.status);
  }

  if (!res.ok || !data.ok) {
    const message = data.error || "Erreur serveur";
    const error = new ApiError(message, res.status);
    if (res.status === 401 && typeof document !== "undefined") {
      clearTokenCookie();
    }
    throw error;
  }

  // Si la réponse contient un token (login flow), le stocker
  if (data.token && typeof document !== "undefined") {
    setTokenCookie(data.token);
  }

  return data as T;
}

// ============================================================
// HELPERS SPÉCIALISÉS
// ============================================================

/** Effectue un login et stocke automatiquement le token. */
export async function login(email: string, password: string): Promise<{ name: string; email: string; role: string }> {
  const data = await apiJson<{ token: string; user: { name: string; email: string; role: string } }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
  return data.user;
}

/** Effectue un logout et nettoie le cookie. */
export async function logout(): Promise<void> {
  try {
    await apiJson("/api/auth/logout", { method: "POST" });
  } catch {
    // Même si le serveur est injoignable, on nettoie le cookie local
  }
  clearTokenCookie();
  invalidateCache();
}

/** Récupère l'utilisateur courant (avec cache). */
export async function fetchCurrentUser<T = { name: string; email: string; role: string }>(): Promise<T | null> {
  try {
    const data = await apiJson<{ user: T }>("/api/auth/me");
    return data.user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    return null;
  }
}

export { API_URL };
