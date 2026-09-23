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
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// MIDDLEWARES GLOBAUXX
// ============================================================
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://yehiortech.com",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("combined"));

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

// ============================================================
// ERROR HANDLER (à placer en dernier)
// ============================================================
app.use(errorHandler);

// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 YEHI OR Tech Backend démarré sur le port ${PORT}`);
  console.log(`📡 Frontend autorisé : ${process.env.FRONTEND_URL || "https://yehiortech.com"}`);
  console.log(`💾 Base de données : ${process.env.DATABASE_URL ? "OK" : "MANQUANTE"}`);
});

export default app;
