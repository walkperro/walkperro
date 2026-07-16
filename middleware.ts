import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function randomBase64Url(byteLen: number): string {
  const buf = new Uint8Array(byteLen);
  crypto.getRandomValues(buf);
  // Convert to base64url
  let str = "";
  for (const b of buf) str += String.fromCharCode(b);
  return btoa(str).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

// Edge middleware:
//  1. Bare-domain → www redirect (preserved).
//  2. Coarse cookie-presence gate for /admin/* — full session validation in server pages.
//  3. CSRF cookie issuance on /admin/* responses (set here because server components
//     can't write cookies in Next.js 15+; only middleware + route handlers + actions can).

const ADMIN_OPEN_PATHS = new Set([
  "/admin/login",
  "/admin/forgot-password",
]);

function isAdminOpen(pathname: string): boolean {
  if (ADMIN_OPEN_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/admin/reset-password/")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // Domain canonicalization is handled at the Vercel platform level
  // (Project → Settings → Domains). Both walkperro.com and www.walkperro.com
  // are aliased to this deploy. The platform 307s the non-primary to the primary.
  // No middleware-level host redirect needed — it would just fight the platform one.

  // Admin gate
  if (url.pathname.startsWith("/admin")) {
    if (!isAdminOpen(url.pathname)) {
      const session = req.cookies.get("wp_admin_session")?.value;
      if (!session) {
        const next = encodeURIComponent(url.pathname + url.search);
        url.pathname = "/admin/login";
        url.search = `?next=${next}`;
        return NextResponse.redirect(url, 307);
      }
    }

    // Ensure CSRF cookie exists for ALL /admin/* responses
    const res = NextResponse.next();
    const csrf = req.cookies.get("wp_csrf")?.value;
    if (!csrf || csrf.length < 24) {
      const tok = randomBase64Url(24);
      res.cookies.set("wp_csrf", tok, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return res;
  }

  // Creator dashboard gate — coarse cookie-presence check (Supabase Auth sets
  // an `sb-<ref>-auth-token` cookie on login). Full validation happens in the
  // page/route via supabase.auth.getUser(). Guarded so it doesn't match
  // /apple-icon.png etc.
  if (url.pathname === "/app" || url.pathname.startsWith("/app/")) {
    const hasSession = req.cookies
      .getAll()
      .some((c) => /^sb-.*-auth-token(\.\d+)?$/.test(c.name));
    if (!hasSession) {
      const next = encodeURIComponent(url.pathname + url.search);
      url.pathname = "/login";
      url.search = `?next=${next}`;
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
