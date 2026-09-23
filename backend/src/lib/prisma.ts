import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prismaBackend: PrismaClient | undefined;
}

/**
 * Singleton PrismaClient pour le backend.
 * Réutilise le schéma du frontend (partagé).
 */
export const prisma =
  globalThis.__prismaBackend ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaBackend = prisma;
}
