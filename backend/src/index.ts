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
import { warmDatabase } from "./lib/prisma";

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// MIDDLEWARES GLOBAUX
// ============================================================
app.use(helmet());
// CORS multiple origines : on accepte le frontend Vercel + le sous-domaine manager
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://yehiortech.com",
  "https://www.yehiortech.com",
  "https://manager.yehiortech.com",
  "http://localhost:3000",
].filter(Boolean) as string[];
app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (curl, postman) ET les origines connues
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(null, false); // ne pas bloquer — réjecte silencieusement
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
// Morgan format court — réduit les I/O fichier
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

// ============================================================
// ERROR HANDLER (à placer en dernier)
// ============================================================
app.use(errorHandler);

// ============================================================
// START — pré-chauffe la DB AVANT d'écouter le port
// Sans ça, la 1ère requête subit 3-5s de handshake SSL vers Neon
// ============================================================
async function start() {
  await warmDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 YEHI OR Tech Backend démarré sur le port ${PORT}`);
    console.log(`📡 Frontend autorisé : ${allowedOrigins.join(", ")}`);
    console.log(`💾 Base de données : ${process.env.DATABASE_URL ? "OK" : "MANQUANTE"}`);
  });
}

start().catch((err) => {
  console.error("❌ Échec du démarrage :", err);
  process.exit(1);
});

export default app;
