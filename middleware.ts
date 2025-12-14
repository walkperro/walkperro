import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  /* thanks session_id rewrite */
  if (url.pathname === "/thanks" && url.searchParams.has("session_id")) {
    const sid = url.searchParams.get("session_id")!;
    return NextResponse.redirect(new URL(`/thanks/${sid}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
