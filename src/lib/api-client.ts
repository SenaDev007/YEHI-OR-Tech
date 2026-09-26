/**
 * Client API pour le back-office YEHI OR Manager.
 *
 * ⭐ ARCHITECTURE REFACTORISÉE :
 * - Routes Vercel (login, stats, content, auth) → même origine (Vercel serverless + pg direct)
 *   → Pas de Prisma, pas de Railway, pas de cold start, pas de CORS cross-origin
 *   → Toujours disponible, rapide (<5s)
 * - Routes Railway uniquement (SaaS Hub remote-tenants, sync-academia-helm) → backend Railway
 *   → Seules ces routes nécessitent Railway (car elles appellent Academia Helm API)
 *
 * Avantages :
 * ✅ Login/stats/content TOUJOURS disponibles (Vercel pg, pas de Prisma)
 * ✅ Pas de CORS cross-origin (même origine Vercel)
 * ✅ Pas de dépendance Railway pour les opérations critiques
 * ✅ SaaS Hub remote features utilisent Railway quand dispo
 */

// URL du backend Railway — utilisée UNIQUEMENT pour les routes Railway-only
const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

// Routes qui nécessitent le backend Railway (proxy Academia Helm API)
const RAILWAY_ONLY_PATTERNS = [
  "/api/content/saas-apps/", // remote-tenants
  "/api/content/saas-tenants/", // sync-academia-helm (POST /:id/sync-academia-helm)
];

/**
 * Détermine si une route doit aller vers Railway ou Vercel.
 * - Routes avec "remote-tenants" ou "sync-academia-helm" → Railway
 * - Tout le reste → Vercel (même origine)
 */
function shouldUseRailway(path: string): boolean {
  if (!RAILWAY_API_URL) return false;
  return path.includes("remote-tenants") || path.includes("sync-academia-helm");
}

// Comportement réseau
const TIMEOUT_MS = 10_000;
const CACHE_TTL = 60_000;
const MAX_RETRIES = 1;

// Timeout plus long pour login (bcrypt + DB)
const SLOW_ROUTES: Record<string, number> = {
  "/api/auth/login": 25_000,
  "/api/auth/forgot-password": 25_000,
  "/api/auth/reset-password": 25_000,
};
function getTimeoutFor(path: string): number {
  return SLOW_ROUTES[path] ?? TIMEOUT_MS;
}

// Cache mémoire
type CacheEntry = { data: unknown; expires: number };
const cache = new Map<string, CacheEntry>();
export function invalidateCache(path?: string) {
  if (path) cache.delete(path);
  else cache.clear();
}

// Cookie JWT
const SESSION_COOKIE = "yehi_manager_session";
function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/yehi_manager_session=([^;]+)/);
  return match ? match[1] : null;
}
export function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7;
  const secure = process.env.NODE_ENV === "production" || (typeof window !== "undefined" && window.location.protocol === "https:");
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
}
export function clearTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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
      if (err instanceof DOMException && err.name === "AbortError") break;
      if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw lastErr;
}

/**
 * Fetch avec auth Bearer auto.
 * ⭐ Route vers Railway SEULEMENT pour les routes SaaS Hub (remote-tenants, sync).
 * Tout le reste va vers Vercel (même origine, pg direct, pas de Prisma).
 */
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

  if (useCache) {
    const hit = cache.get(path);
    if (hit && hit.expires > Date.now()) {
      const blob = new Blob([JSON.stringify(hit.data)], { type: "application/json" });
      return new Response(blob, { status: 200, headers: { "Content-Type": "application/json" } });
    }
  }

  // ⭐ DÉTERMINE L'URL CIBLE :
  // - Railway-only routes (remote-tenants, sync) → backend Railway
  // - Tout le reste → Vercel same-origin (pg direct, pas de Prisma, pas de CORS)
  const useRailway = shouldUseRailway(path);
  const targetUrl = useRailway ? `${RAILWAY_API_URL}${path}` : path;

  try {
    const res = await fetchWithRetry(targetUrl, { ...options, headers, method }, timeoutMs);
    if (useCache && res.ok) {
      try {
        const cloned = res.clone();
        const data = await cloned.json();
        cache.set(path, { data, expires: Date.now() + CACHE_TTL });
      } catch {}
    }
    return res;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(`Le serveur met trop de temps à répondre (timeout ${Math.round(timeoutMs / 1000)}s). Réessaie.`, 408);
    }
    if (useRailway && RAILWAY_API_URL) {
      throw new ApiError(`Backend Railway (${RAILWAY_API_URL}) injoignable pour ${path}. Le backend Railway est peut-être down. Les autres fonctionnalités (login, dashboard) restent disponibles via Vercel.`, 0);
    }
    throw new ApiError(`Impossible de joindre le serveur (route: ${path}).`, 0);
  }
}

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
    if (res.status === 401 && typeof document !== "undefined") clearTokenCookie();
    throw error;
  }

  if (data.token && typeof document !== "undefined") setTokenCookie(data.token);
  return data as T;
}

// Helpers
export async function login(email: string, password: string): Promise<{ name: string; email: string; role: string }> {
  const data = await apiJson<{ token: string; user: { name: string; email: string; role: string } }>(
    "/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }
  );
  return data.user;
}

export async function logout(): Promise<void> {
  try { await apiJson("/api/auth/logout", { method: "POST" }); } catch {}
  clearTokenCookie();
  invalidateCache();
}

export async function fetchCurrentUser<T = { name: string; email: string; role: string }>(): Promise<T | null> {
  try {
    const data = await apiJson<{ user: T }>("/api/auth/me");
    return data.user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    return null;
  }
}

export { RAILWAY_API_URL };
