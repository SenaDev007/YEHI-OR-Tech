/**
 * Client API pour appeler le backend Railway.
 * Toutes les routes API sont maintenant sur le backend (backend.yehiortech.com).
 * Le frontend ne fait que des appels fetch vers le backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Récupère le token JWT depuis le cookie.
 */
function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/yehi_manager_session=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Définit le token JWT dans un cookie.
 */
export function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7; // 7 jours
  document.cookie = `yehi_manager_session=${token}; path=/; max-age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

/**
 * Supprime le token JWT du cookie.
 */
export function clearTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "yehi_manager_session=; path=/; max-age=0";
}

/**
 * Fetch vers le backend avec auth Bearer automatique.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${API_URL}${path}`, { ...options, headers });
}

/**
 * Fetch + JSON parse avec gestion d'erreur.
 */
export async function apiJson<T = { ok: boolean; [key: string]: unknown }>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Erreur serveur");
  }
  return data as T;
}

export { API_URL };
