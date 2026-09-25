"use client";

import { useEffect, useState } from "react";
import { apiJson, ApiError } from "./api-client";

/**
 * Hook générique pour charger du contenu depuis l'API publique
 * avec fallback automatique sur des données statiques.
 *
 * Pattern Win-Agro : les pages publiques essaient d'abord l'API
 * (contenu éditable depuis le manager). Si l'API est injoignable
 * ou la DB vide, on retombe sur les fichiers src/data/*.ts.
 *
 * Usage :
 *   const { data, loading, error } = useContent(
 *     "/api/leads/services",
 *     () => import("@/data/services").then(m => m.services)
 *   );
 */
export function useContent<T>(
  apiPath: string,
  fallback: () => Promise<T> | T,
): { data: T | null; loading: boolean; error: string | null; usingFallback: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await apiJson<{ data: T[] } | { data: T } | { data: Record<string, string> }>(apiPath);
        if (!mounted) return;
        // Si data est un tableau vide → fallback
        const d = result.data;
        if (Array.isArray(d) && d.length === 0) {
          const fb = await fallback();
          if (mounted) { setData(fb as T); setUsingFallback(true); }
          return;
        }
        if (typeof d === "object" && d !== null && !Array.isArray(d) && Object.keys(d).length === 0) {
          const fb = await fallback();
          if (mounted) { setData(fb as T); setUsingFallback(true); }
          return;
        }
        if (mounted) { setData(d as unknown as T); setUsingFallback(false); }
      } catch (err) {
        // Erreur réseau/timeout → fallback statique
        if (!mounted) return;
        if (err instanceof ApiError) setError(err.message);
        else setError("Chargement impossible");
        try {
          const fb = await fallback();
          if (mounted) { setData(fb as T); setUsingFallback(true); }
        } catch (fbErr) {
          if (mounted) setError("Aucune donnée disponible");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [apiPath]);

  return { data, loading, error, usingFallback };
}
