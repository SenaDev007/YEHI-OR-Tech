import { Router } from "express";

export const healthRouter = Router();

/**
 * GET /api/health
 *
 * ⭐ LIVENESS CHECK — retourne TOUJOURS 200.
 * N'import PAS prisma (même pas en top-level) pour éviter tout crash
 * lié au moteur Rust de Prisma au démarrage.
 */
healthRouter.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "operational",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * GET /api/health/db — Check DB (lazy import Prisma, peut retourner 503)
 */
healthRouter.get("/db", async (req, res) => {
  const start = Date.now();
  try {
    // Lazy import — ne charge Prisma que si cette route est appelée
    const { prisma } = await import("../lib/prisma");
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
    });
  }
});
