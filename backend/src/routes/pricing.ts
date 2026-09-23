import { Router } from "express";

// Squelette — à implémenter
export const pricingRouter = Router();

pricingRouter.get("/", (req, res) => {
  res.json({ ok: true, message: "Route pricing — packs tarifaires" });
});
