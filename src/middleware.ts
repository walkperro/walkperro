import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="WalkPerro Admin", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_LEADS_USER;
  const expectedPass = process.env.ADMIN_LEADS_PASSWORD;

  if (!expectedUser || !expectedPass) {
    const missing = [
      !expectedUser ? "ADMIN_LEADS_USER" : null,
      !expectedPass ? "ADMIN_LEADS_PASSWORD" : null,
    ].filter(Boolean);
    return new NextResponse(`Admin credentials are not configured. Missing env vars: ${missing.join(", ")}`, {
      status: 503,
    });
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return unauthorized();
  }

  const encoded = auth.slice(6).trim();

  let decoded = "";
  try {
    decoded = atob(encoded);
  } catch {
    return unauthorized();
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) return unauthorized();

  const user = decoded.slice(0, separator);
  const pass = decoded.slice(separator + 1);

  if (user !== expectedUser || pass !== expectedPass) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
