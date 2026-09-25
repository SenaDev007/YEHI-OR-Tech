import { Router } from "express";
import { prisma } from "../lib/prisma";

export const healthRouter = Router();

/**
 * GET /api/health
 *
 * ⭐ LIGHTWEIGHT LIVENESS CHECK — retourne TOUJOURS 200.
 *
 * Railway utilise cette route comme healthcheck (railway.json deploy.healthcheckPath).
 * Si on retourne 5xx, Railway marque le service "unhealthy" et renvoie 502 fallback
 * à tous les clients. C'est ce qui cause le 502 "Application failed to respond".
 *
 * ❌ AVANT : on dépendait de Prisma ($queryRaw SELECT 1) pour vérifier la DB.
 *    Si Prisma échoue (Neon cold start, latence réseau, IP filtering), /api/health
 *    retournait 503 → Railway unhealthy → 502 → frontend cassé.
 *
 * ✅ APRÈS : /api/health retourne TOUJOURS 200. Le statut DB est dans le body
 *    (database: "connected" | "degraded"). Railway garde le service Running.
 *    Les routes individuelles (/api/auth/login, /api/content/*, etc.) gèrent
 *    leurs propres erreurs DB avec des messages clairs.
 *
 * Une route séparée /api/health/db fait le check DB complet (peut retourner 503).
 */
healthRouter.get("/", (req, res) => {
  // Pas de await — on répond immédiatement avec 200
  // Le process est en vie, c'est tout ce que Railway a besoin de savoir
  res.json({
    ok: true,
    status: "operational",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    // ⚠️ Ne pas inclure database: "connected" ici car on ne teste pas
    // Voir /api/health/db pour le check DB complet
  });
});

/**
 * GET /api/health/db — Check DB complet (peut retourner 503)
 *
 * Cette route fait le vrai test de connexion DB via Prisma.
 * Elle peut retourner 503 si la DB est injoignable.
 * Railway ne l'utilise PAS comme healthcheck (le healthcheck principal est /api/health).
 *
 * Utilise-la pour diagnostiquer l'état DB sans impacter le service Railway.
 */
healthRouter.get("/db", async (req, res) => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const elapsedMs = Date.now() - start;
    res.json({
      ok: true,
      database: "connected",
      latencyMs: elapsedMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const elapsedMs = Date.now() - start;
    res.status(503).json({
      ok: false,
      database: "disconnected",
      latencyMs: elapsedMs,
      error: err instanceof Error ? err.message : "Unknown error",
      // Diagnostic hints
      hints: [
        "Vérifie que DATABASE_URL contient ?sslmode=require (Neon exige SSL)",
        "Pour Neon pooler, ajoute &pgbouncer=true&connection_limit=1 à DATABASE_URL",
        "Neon free tier auto-pause la DB après inactivité — le 1er appel peut prendre 5-10s",
        "Si le problème persiste, vérifie Neon dashboard > Settings > IP Allow",
      ],
    });
  }
});
