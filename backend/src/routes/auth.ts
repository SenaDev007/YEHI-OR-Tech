import { Router, type Request, type Response, type NextFunction } from "express";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

export const authRouter = Router();

const SESSION_DURATION = "7d";
const COOKIE_NAME = "yehi_session";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant");
  return new TextEncoder().encode(secret);
}

async function signSession(payload: Record<string, unknown>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecret());
}

async function verifySession(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * POST /api/auth/login
 */
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
      return res.status(401).json({ ok: false, error: "Identifiants incorrects" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ ok: false, error: "Identifiants incorrects" });
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
    });

    return res.json({
      ok: true,
      token,
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/auth/me
 * Vérifie le token JWT (header Authorization: Bearer <token>)
 */
authRouter.get("/me", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Token manquant" });
  }

  const token = auth.slice(7);
  const payload = await verifySession(token);
  if (!payload) {
    return res.status(401).json({ ok: false, error: "Token invalide ou expiré" });
  }

  return res.json({
    ok: true,
    user: {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      organizationId: payload.organizationId,
    },
  });
});

export { verifySession, signSession };
