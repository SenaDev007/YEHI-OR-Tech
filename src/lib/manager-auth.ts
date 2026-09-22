import { createHmac, timingSafeEqual } from "node:crypto";

export const managerCookieName = "yehi_manager_session";

type SessionPayload = { email: string; name?: string; provider: "password" | "google"; exp: number };

function secret() {
  return process.env.MANAGER_AUTH_SECRET || "development-only-secret-change-before-production";
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function signManagerSession(payload: SessionPayload) {
  const body = encode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifyManagerSession(value?: string | null): SessionPayload | null {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(decode(body)) as SessionPayload;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export function allowedManagerEmail(email: string) {
  const configured = process.env.MANAGER_ALLOWED_EMAILS?.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  return !configured?.length || configured.includes(email.toLowerCase());
}
