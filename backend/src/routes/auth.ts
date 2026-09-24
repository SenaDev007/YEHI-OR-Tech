import { Router, type Request, type Response, type NextFunction } from "express";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

export const authRouter = Router();

const SESSION_DURATION = "7d";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: Record<string, unknown>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Middleware d'authentification (Bearer token)
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Non authentifié" });
  }
  const token = auth.slice(7);
  const payload = await verifySession(token);
  if (!payload) {
    return res.status(401).json({ ok: false, error: "Token invalide ou expiré" });
  }
  (req as unknown as { user: Record<string, unknown> }).user = payload;
  next();
}

// ============================================================
// POST /api/auth/login
// ============================================================
authRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "Email + mot de passe requis" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { organization: true },
    });

    if (!user || !user.active) {
      return res.status(401).json({ ok: false, error: "Identifiants incorrects ou compte désactivé." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ ok: false, error: "Identifiants incorrects." });
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    });

    await prisma.auditEvent.create({
      data: {
        action: "login",
        entity: "User",
        entityId: user.id,
        details: "Connexion réussie (backend Railway)",
        userId: user.id,
      },
    }).catch(() => {});

    return res.json({
      ok: true,
      token,
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("[auth/login] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// GET /api/auth/me
// ============================================================
authRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const user = (req as unknown as { user: Record<string, unknown> }).user;
  return res.json({
    ok: true,
    user: {
      id: user.sub,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    },
  });
});

// ============================================================
// POST /api/auth/logout
// ============================================================
authRouter.post("/logout", authMiddleware, async (req: Request, res: Response) => {
  const user = (req as unknown as { user: Record<string, unknown> }).user;
  try {
    await prisma.auditEvent.create({
      data: {
        action: "logout",
        entity: "User",
        entityId: String(user.sub || ""),
        userId: String(user.sub || null),
      },
    }).catch(() => {});
  } catch {}
  return res.json({ ok: true });
});

// ============================================================
// POST /api/auth/forgot-password
// ============================================================
authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ ok: false, error: "Email requis" });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.active) {
      return res.json({ ok: true, message: "Si ce compte existe, un email a été envoyé." });
    }

    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordReset.updateMany({
      where: { email: email.toLowerCase(), used: false },
      data: { used: true },
    }).catch(() => {});

    await prisma.passwordReset.create({
      data: { email: email.toLowerCase(), token, expiresAt },
    }).catch(() => {});

    const baseUrl = process.env.FRONTEND_URL || "https://yehiortech.com";
    const resetUrl = `${baseUrl}/manager/reset-password?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || "noreply@yehiortech.com",
          to: email,
          subject: "YEHI OR Manager — Réinitialisation de mot de passe",
          html: `<p>Clique ici pour réinitialiser ton mot de passe :</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Ce lien expire dans 1 heure.</p>`,
        });
      } catch {}
    }

    return res.json({ ok: true, message: "Si ce compte existe, un email a été envoyé." });
  } catch (err) {
    console.error("[auth/forgot-password] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});

// ============================================================
// POST /api/auth/reset-password
// ============================================================
authRouter.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ ok: false, error: "Token et mot de passe (8+ chars) requis" });
    }

    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
      return res.status(400).json({ ok: false, error: "Lien invalide ou expiré" });
    }

    const user = await prisma.user.findUnique({ where: { email: reset.email } });
    if (!user) return res.status(404).json({ ok: false, error: "Compte introuvable" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });

    return res.json({ ok: true, message: "Mot de passe réinitialisé" });
  } catch (err) {
    console.error("[auth/reset-password] Erreur:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
});
