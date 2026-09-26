import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { leadsRouter } from "./routes/leads";
import { servicesRouter } from "./routes/services";
import { pricingRouter } from "./routes/pricing";
import { managerRouter } from "./routes/manager";
import { contentRouter } from "./routes/content";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// MIDDLEWARES GLOBAUX
// ============================================================
app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://yehiortech.com",
  "https://www.yehiortech.com",
  "https://manager.yehiortech.com",
  "http://localhost:3000",
].filter(Boolean) as string[];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

// ============================================================
// ROUTES
// ============================================================
app.get("/", (req, res) => {
  res.json({
    name: "YEHI OR Tech API",
    version: "1.0.0",
    status: "operational",
    docs: "/api/health",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/pricing", pricingRouter);
app.use("/api/manager", managerRouter);
app.use("/api/content", contentRouter);

app.use(errorHandler);

// ============================================================
// START — ÉCOUTE IMMÉDIATE, DB warm en arrière-plan (non-bloquant)
// ⭐ CRITIQUE : ne PAS attendre warmDatabase() avant app.listen()
// Si on attend, le serveur ne démarre pas pendant 25s (Prisma timeout
// Neon cold start) → Railway healthcheck échoue → 502 crash loop.
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 YEHI OR Tech Backend démarré sur le port ${PORT}`);
  console.log(`📡 Frontend autorisé : ${allowedOrigins.join(", ")}`);
  console.log(`💾 Base de données : ${process.env.DATABASE_URL ? "OK" : "MANQUANTE"}`);

  // Warm DB en arrière-plan — non bloquant
  // Si Neon est en cold start, ça prendra 5-10s mais le serveur répond déjà
  import("./lib/prisma")
    .then(({ warmDatabase }) => warmDatabase())
    .catch(() => {
      // Prisma peut être en cold start — pas grave, les routes utilisent pg
    });
});

export default app;
