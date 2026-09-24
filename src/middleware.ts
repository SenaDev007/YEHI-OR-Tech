import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "yehi_manager_session";
const PUBLIC_MANAGER_PATHS = [
  "/manager/login",
  "/manager/forgot-password",
  "/manager/reset-password",
];

/**
 * Middleware Next.js — gère :
 * 1. Le routing du sous-domaine manager.yehiortech.com → /manager/*
 * 2. La protection des routes /manager/* (sauf pages publiques login/forgot/reset)
 * 3. La redirection vers /manager/login si non authentifié
 *
 * Fonctionne sur Edge runtime (jose est edge-compatible).
 */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const path = request.nextUrl.pathname;

  // ⚠️ NE JAMAIS réécrire les routes /api/* — sinon le sous-domaine manager.*
  // transformerait /api/manager/stats en /manager/api/manager/stats (404).
  // Le matcher exclut déjà /api/* (voir config en bas), mais on garde cette
  // garde-fou au cas où.
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Détection du sous-domaine manager.*
  const isManagerSubdomain = host.startsWith("manager.");

  // ============================================================
  // Cas 1 : sous-domaine manager.* — rewrite vers /manager/*
  // ============================================================
  if (isManagerSubdomain && !path.startsWith("/manager")) {
    const url = request.nextUrl.clone();
    url.pathname = path === "/" ? "/manager" : `/manager${path}`;

    // Vérifier l'auth avant de réécrire (sauf page publique)
    const targetPath = url.pathname;
    const isPublic = PUBLIC_MANAGER_PATHS.some(
      (p) => targetPath === p || targetPath.startsWith(p + "/")
    );
    if (!isPublic) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (!(await isValidToken(token))) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/manager/login";
        loginUrl.searchParams.set("redirect", path === "/" ? "/dashboard" : path);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.rewrite(url);
  }

  // ============================================================
  // Cas 2 : accès direct à /manager/* sur le domaine principal
  // ============================================================
  if (path.startsWith("/manager")) {
    const isPublic = PUBLIC_MANAGER_PATHS.some(
      (p) => path === p || path.startsWith(p + "/")
    );
    if (!isPublic) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (!(await isValidToken(token))) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/manager/login";
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

// Matcher : tout SAUF les fichiers statiques, ET toutes les routes /api/*
// (les routes API ne doivent jamais être réécrites par le middleware,
// sinon le sous-domaine manager.* casserait tous les appels fetch).
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-96.png|icon-192.png|icon-512.png|apple-icon.png|manifest.json|robots.txt|sitemap.xml|api).*)",
  ],
};
