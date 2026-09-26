import { Client } from "pg";

let cachedClient: Client | null = null;
let connectPromise: Promise<Client> | null = null;

/**
 * Client pg singleton pour le backend Railway.
 *
 * ⚠️ Prisma (Rust engine) peut timeout 25s+ quand Neon est en cold start.
 * pg (pure JS) gère mieux les cold starts Neon avec timeout 5s.
 *
 * Utilisé comme fallback/primary pour les routes critiques (login, health).
 */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL manquant");
  return url.replace(/^["']|["']$/g, "");
}

async function getClient(): Promise<Client> {
  if (cachedClient) {
    // Vérifier si la connexion est encore active
    try {
      await cachedClient.query("SELECT 1");
      return cachedClient;
    } catch {
      cachedClient = null;
    }
  }

  if (connectPromise) return connectPromise;

  const client = new Client({
    connectionString: getDatabaseUrl(),
    connectionTimeoutMillis: 5000, // 5s — beaucoup plus rapide que Prisma
  });

  connectPromise = client.connect().then(() => {
    cachedClient = client;
    connectPromise = null;
    return client;
  }).catch((err) => {
    connectPromise = null;
    throw err;
  });

  return connectPromise;
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  try {
    const client = await getClient();
    const result = await client.query(text, params as never[]);
    return (result.rows[0] as T) ?? null;
  } catch (err) {
    console.error("[pg] queryOne erreur:", err instanceof Error ? err.message : "unknown");
    // Reset client on error
    cachedClient = null;
    throw err;
  }
}

export async function queryMany<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  try {
    const client = await getClient();
    const result = await client.query(text, params as never[]);
    return result.rows as T[];
  } catch (err) {
    console.error("[pg] queryMany erreur:", err instanceof Error ? err.message : "unknown");
    cachedClient = null;
    throw err;
  }
}

export async function queryExec(
  text: string,
  params: unknown[] = []
): Promise<number> {
  try {
    const client = await getClient();
    const result = await client.query(text, params as never[]);
    return result.rowCount || 0;
  } catch (err) {
    console.error("[pg] queryExec erreur:", err instanceof Error ? err.message : "unknown");
    cachedClient = null;
    throw err;
  }
}
