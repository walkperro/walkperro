import { cookies } from "next/headers";
import { randomToken, timingSafeEqual } from "@/lib/encryption";
import { NextRequest } from "next/server";

export const CSRF_COOKIE = "wp_csrf";

/** Ensures a CSRF cookie exists; returns the token value. Call from server components/layouts. */
export async function ensureCsrf(): Promise<string> {
  const c = await cookies();
  const existing = c.get(CSRF_COOKIE)?.value;
  if (existing && existing.length >= 32) return existing;
  const tok = randomToken(24);
  c.set(CSRF_COOKIE, tok, {
    httpOnly: false, // must be readable by JS for double-submit pattern
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return tok;
}

/** Validates the double-submit cookie. Used by API routes. */
export async function verifyCsrf(req: NextRequest): Promise<boolean> {
  const cookieTok = req.cookies.get(CSRF_COOKIE)?.value;
  const headerTok = req.headers.get("x-csrf-token");
  if (!cookieTok || !headerTok) return false;
  return timingSafeEqual(cookieTok, headerTok);
}
