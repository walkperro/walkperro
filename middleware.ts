import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // 1) Force canonical domain (keeps cookies/storage consistent)
  if (host === "walkperro.com") {
    url.hostname = "www.walkperro.com";
    return NextResponse.redirect(url, 308);
  }

  // 2) If Stripe returns to /thanks with a session id in query, redirect to /thanks/[sid]
  if (url.pathname === "/thanks") {
    const sid =
      url.searchParams.get("session_id") ||
      url.searchParams.get("checkout_session_id") ||
      url.searchParams.get("sid") ||
      url.searchParams.get("session");

    if (sid && sid.trim()) {
      url.pathname = `/thanks/${encodeURIComponent(sid)}`;
      url.search = ""; // drop query; the dynamic route reads sid from path
      return NextResponse.redirect(url, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
