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
const TIMEOUT_MS = 10_000; // 10s max
const CACHE_TTL = 60_000; // 60s pour les GET
const MAX_RETRIES = 1; // 1 retry sur erreur réseau

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
async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetchWithTimeout(url, options);
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
// FETCH PUBLIC (avec auth Bearer auto + fallback same-origin)
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

  // Pour les GET, vérifier le cache avant d'envoyer la requête
  if (useCache) {
    const hit = cache.get(path);
    if (hit && hit.expires > Date.now()) {
      const blob = new Blob([JSON.stringify(hit.data)], { type: "application/json" });
      return new Response(blob, { status: 200, headers: { "Content-Type": "application/json" } });
    }
  }

  // 1er essai : si API_URL est défini, on tente le backend Railway
  if (API_URL) {
    try {
      const res = await fetchWithRetry(`${API_URL}${path}`, { ...options, headers, method });
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
      // Si le backend Railway est injoignable (DNS, connexion refusée, CORS),
      // on retente sur la même origine (routes Next.js Vercel) — plus lent mais
      // au moins l'app reste utilisable.
      console.warn(`[apiFetch] Backend ${API_URL} injoignable pour ${path}, fallback same-origin.`, err);
      // Ne pas re-retenter si on est en HTTP route (next: options.method non-GET)
      // Le fallback continue ci-dessous
    }
  }

  // Fallback (ou cas par défaut sans API_URL) : même origine
  try {
    const res = await fetchWithRetry(path, { ...options, headers, method });
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
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Le serveur met trop de temps à répondre (timeout 10s). Réessaie.", 408);
    }
    throw new ApiError("Impossible de joindre le serveur. Vérifie ta connexion internet.", 0);
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
      throw new ApiError("Le serveur met trop de temps à répondre (timeout 10s). Réessaie.", 408);
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
