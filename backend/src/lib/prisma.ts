import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prismaBackend: PrismaClient | undefined;
}

/**
 * Singleton Prisma — partagé entre toutes les requêtes sur le même processus.
 * En production (Railway), le processus reste chaud entre les requêtes, donc
 * la connexion est déjà ouverte. En dev, on évite d'ouvrir trop de clients
 * à chaque hot-reload via le cache globalThis.
 */
export const prisma =
  globalThis.__prismaBackend ??
  new PrismaClient({
    log: ["error"],
    // Datasource tweaks — Prisma 5 supporte connection_limit via DATABASE_URL
    // mais on peut aussi forcer un pool plus agressif ici.
    datasources: {
      db: {
        // Si DATABASE_URL n'est pas explicitement surchargée, Prisma lit process.env.DATABASE_URL
        // On laisse Prisma gérer, mais on ajoute un pooler_url si disponible.
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaBackend = prisma;
}

/**
 * Pré-chauffre la connexion à la base de données au démarrage du serveur.
 * À appeler dans src/index.ts avant app.listen().
 * Sans ça, la première requête utilisateur subit le timeout de connexion
 * (parfois 3-5s sur Neon avec SSL handshake).
 */
let warmed = false;
export async function warmDatabase(): Promise<void> {
  if (warmed) return;
  warmed = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("[db] ✅ Connexion pré-chauffée avec succès");
  } catch (err) {
    console.warn("[db] ⚠️ Pré-chauffe échouée (la 1ère requête sera lente) :", err instanceof Error ? err.message : "unknown");
    // Pas fatal — le serveur démarre quand même
  }
}

// Statistiques cache (30s) — évite de refaire 13 requêtes à chaque visite du dashboard
type StatsEntry = { data: unknown; expires: number };
const statsCache = new Map<string, StatsEntry>();
const STATS_CACHE_TTL = 30_000; // 30s

/**
 * Cache court pour les statistiques — partage entre requêtes concurrentes.
 * La première requête paye le coût des 13 sous-requêtes, les suivantes
 * (dans les 30s) sont instantanées.
 */
export async function getCachedStats<T>(key: string, compute: () => Promise<T>): Promise<T> {
  const hit = statsCache.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.data as T;
  }
  const data = await compute();
  statsCache.set(key, { data, expires: Date.now() + STATS_CACHE_TTL });
  return data;
}

/** Invalide le cache des stats (utile après une mutation). */
export function invalidateStatsCache(key?: string) {
  if (key) statsCache.delete(key);
  else statsCache.clear();
}
