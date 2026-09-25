import { Client } from "pg";

let cachedClient: Client | null = null;
let clientConnected = false;
let connectPromise: Promise<Client> | null = null;

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
 * Réduit le timeout à 5s (était 30s — causait les blocages de 30s+).
 * Déduplique les connexions en cours (évite les N connexions simultanées
 * au démarrage à froid).
 */
async function getClient(): Promise<Client> {
  if (cachedClient && clientConnected) {
    return cachedClient;
  }

  // Si une connexion est déjà en cours, attend qu'elle finit (sans relancer)
  if (connectPromise) return connectPromise;

  const client = new Client({
    connectionString: getDatabaseUrl(),
    connectionTimeoutMillis: 5000, // 5s au lieu de 30s
  });

  connectPromise = client.connect().then(() => {
    cachedClient = client;
    clientConnected = true;
    connectPromise = null;
    return client;
  }).catch((err) => {
    connectPromise = null;
    throw err;
  });

  return connectPromise;
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
