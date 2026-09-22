import { NextResponse } from "next/server";
import { managerCookieName } from "@/lib/manager-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/manager/login", request.url));
  response.cookies.set(managerCookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
