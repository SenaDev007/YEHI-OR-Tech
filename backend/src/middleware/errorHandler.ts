import { type Request, type Response, type NextFunction } from "express";

/**
 * Middleware de gestion d'erreurs global.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error("[ERROR]", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    ok: false,
    error: err instanceof Error ? err.message : "Erreur serveur interne",
  });
}
