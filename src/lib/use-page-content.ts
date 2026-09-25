"use client";

import { useEffect, useState } from "react";
import { apiJson, ApiError, invalidateCache } from "./api-client";

/**
 * Cache en mémoire partagée pour PageContent.
 * Évite de refetcher pour chaque composant qui utilise les mêmes textes.
 */
const sharedCache = new Map<string, { data: Record<string, string>; expires: number }>();
const SHARED_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Hook pour charger le PageContent d'une page donnée.
 *
 * Usage :
 *   const { content, loading } = usePageContent("home");
 *   return <h1>{content.hero_title}</h1>;
 *
 * Le cache est partagé entre tous les composants qui appellent
 * usePageContent("home") — 1 seule requête HTTP par page.
 */
export function usePageContent(page: string): {
  content: Record<string, string>;
  loading: boolean;
  error: string | null;
} {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const cacheKey = page;

    // Vérifier le cache partagé
    const cached = sharedCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      setContent(cached.data);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const result = await apiJson<{ data: Record<string, string> }>(
          `/api/leads/page-content?page=${encodeURIComponent(page)}`
        );
        if (!mounted) return;
        const data = result.data || {};
        setContent(data);
        sharedCache.set(cacheKey, { data, expires: Date.now() + SHARED_CACHE_TTL });
      } catch (err) {
        if (!mounted) return;
        // Pas de fallback — on garde le cache vide, les composants doivent avoir leurs propres valeurs par défaut
        if (err instanceof ApiError && err.status !== 401) {
          setError(err.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [page]);

  return { content, loading, error };
}

/**
 * Invalide le cache PageContent pour une page (après édition manager).
 */
export function invalidatePageContentCache(page?: string) {
  if (page) {
    sharedCache.delete(page);
  } else {
    sharedCache.clear();
  }
  invalidateCache(`/api/leads/page-content?page=${page || ""}`);
}
