import { NextResponse } from "next/server";

/**
 * GET /api/debug
 * Endpoint de diagnostic — vérifie la configuration et la connexion DB.
 */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;

  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    DATABASE_URL_set: !!dbUrl,
    DATABASE_URL_preview: dbUrl ? dbUrl.substring(0, 30) + "..." : "NOT SET",
    JWT_SECRET_set: !!jwtSecret,
    JWT_SECRET_length: jwtSecret?.length || 0,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "NOT SET",
    // ⭐ SaaS Hub variables (server-side, pas NEXT_PUBLIC_)
    ACADEMIA_HELM_API_URL: process.env.ACADEMIA_HELM_API_URL || "(VIDE — ajoute sur Vercel !)",
    ACADEMIA_HELM_ADMIN_EMAIL: process.env.ACADEMIA_HELM_ADMIN_EMAIL ? "(configuré)" : "(VIDE — requis pour créer des écoles)",
    // Test direct de l'endpoint public Academia Helm
    academiaHelmTestUrl: process.env.ACADEMIA_HELM_API_URL
      ? (process.env.ACADEMIA_HELM_API_URL.endsWith("/api")
        ? `${process.env.ACADEMIA_HELM_API_URL}/public/schools/list`
        : `${process.env.ACADEMIA_HELM_API_URL}/api/public/schools/list`)
      : "(non testable — ACADEMIA_HELM_API_URL vide)",
  };

  // Test connexion DB via pg
  if (dbUrl) {
    try {
      const { Client } = await import("pg");
      const client = new Client({
        connectionString: dbUrl,
        connectionTimeoutMillis: 10000,
      });
      await client.connect();
      const res = await client.query('SELECT COUNT(*) as count FROM "User"');
      checks.db_connected = true;
      checks.db_user_count = Number(res.rows[0].count);
      await client.end();
    } catch (err) {
      checks.db_connected = false;
      checks.db_error = err instanceof Error ? err.message : String(err);
    }
  } else {
    checks.db_connected = false;
    checks.db_error = "DATABASE_URL not set";
  }

  return NextResponse.json(checks);
}
