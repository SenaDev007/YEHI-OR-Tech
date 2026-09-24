import { Client } from "pg";

let cachedClient: Client | null = null;
let clientConnected = false;

/**
 * Récupère la DATABASE_URL depuis les variables d'environnement.
 */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL manquant");
  }
  return url.replace(/^["']|["']$/g, "");
}

/**
 * Client pg singleton (connexion réutilisée).
 */
async function getClient(): Promise<Client> {
  if (cachedClient && clientConnected) {
    return cachedClient;
  }

  const client = new Client({
    connectionString: getDatabaseUrl(),
    connectionTimeoutMillis: 30000,
  });

  await client.connect();
  cachedClient = client;
  clientConnected = true;
  return client;
}

/**
 * Exécute une requête SQL via pg (pure JavaScript, bypass Prisma Rust engine).
 * Utilisé comme fallback quand Prisma ne peut pas se connecter.
 */
export async function queryWithFallback(text: string, params: unknown[] = []) {
  const client = await getClient();
  return client.query(text, params as never[]);
}

/**
 * Exécute une requête et retourne la première ligne.
 */
export async function queryOne<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T | null> {
  const result = await queryWithFallback(text, params);
  return (result.rows[0] as T) ?? null;
}

/**
 * Exécute une requête et retourne toutes les lignes.
 */
export async function queryMany<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await queryWithFallback(text, params);
  return result.rows as T[];
}
