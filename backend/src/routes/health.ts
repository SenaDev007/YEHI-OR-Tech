import { Router } from "express";

export const healthRouter = Router();

/**
 * GET /api/health
 * Vérifie l'état du backend + de la DB.
 */
healthRouter.get("/", async (req, res) => {
  try {
    // Import dynamique pour éviter de bloquer le démarrage si la DB est lente
    const { prisma } = await import("../lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      ok: true,
      status: "operational",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      status: "degraded",
      database: "disconnected",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});
