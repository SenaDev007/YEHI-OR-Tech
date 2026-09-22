import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${new URL(request.url).origin}/api/manager/google/callback`;
  if (!clientId) return NextResponse.redirect(new URL("/manager/login?error=google_not_configured", request.url));
  const state = randomBytes(24).toString("hex");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  const response = NextResponse.redirect(url);
  response.cookies.set("yehi_manager_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/manager/google", maxAge: 600 });
  return response;
}
