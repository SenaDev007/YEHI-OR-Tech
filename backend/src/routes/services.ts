import { Router } from "express";

// Squelette — à compléter quand le frontend sera branché sur le backend Railway
export const servicesRouter = Router();

servicesRouter.get("/", (req, res) => {
  res.json({ ok: true, message: "Route services — à implémenter" });
});
