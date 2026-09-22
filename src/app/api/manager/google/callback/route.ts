import { NextResponse } from "next/server";
import { managerCookieName, signManagerSession, allowedManagerEmail } from "@/lib/manager-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.headers.get("cookie")?.match(/yehi_manager_oauth_state=([^;]+)/)?.[1];
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${url.origin}/api/manager/google/callback`;
  if (!code || !state || state !== cookieState || !clientId || !clientSecret || !process.env.MANAGER_AUTH_SECRET) return NextResponse.redirect(new URL("/manager/login?error=google_failed", request.url));

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
  if (!tokenResponse.ok) return NextResponse.redirect(new URL("/manager/login?error=google_failed", request.url));
  const tokens = await tokenResponse.json() as { access_token?: string };
  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { authorization: `Bearer ${tokens.access_token}` } });
  const profile = await profileResponse.json() as { email?: string; name?: string };
  if (!profile.email || !allowedManagerEmail(profile.email)) return NextResponse.redirect(new URL("/manager/login?error=not_allowed", request.url));

  const response = NextResponse.redirect(new URL("/manager", request.url));
  response.cookies.set(managerCookieName, signManagerSession({ email: profile.email, name: profile.name, provider: "google", exp: Date.now() + 1000 * 60 * 60 * 12 }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  response.cookies.delete("yehi_manager_oauth_state");
  return response;
}
