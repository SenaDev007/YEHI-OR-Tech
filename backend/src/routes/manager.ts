import { Router } from "express";

// Squelette — routes manager (protégées par JWT)
export const managerRouter = Router();

managerRouter.get("/", (req, res) => {
  res.json({ ok: true, message: "Route manager — routes protégées à implémenter" });
});
