import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, readSessionToken, type AdminUser } from "./sessions";
import { verifyCsrf } from "./csrf";
import { rateLimit } from "@/lib/rate-limit";

export type AdminApiContext = {
  user: AdminUser;
  ip: string | null;
  userAgent: string | null;
};

/**
 * Wraps an admin API route: validates session + CSRF (for mutating methods) + rate limit.
 * Returns the AdminApiContext for handlers, or a NextResponse to short-circuit.
 */
export async function withAdmin(
  req: NextRequest,
  options: { requireCsrf?: boolean } = {}
): Promise<AdminApiContext | NextResponse> {
  const token = await readSessionToken();
  const user = await getSessionUser(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  if ((options.requireCsrf ?? true) && isMutating) {
    if (!(await verifyCsrf(req))) {
      return NextResponse.json({ ok: false, error: "csrf" }, { status: 403 });
    }
  }

  // Per-admin rate limit
  const { limited } = await rateLimit(`admin:${user.id}`, { windowSeconds: 60, max: 120 });
  if (limited) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  return {
    user,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    userAgent: req.headers.get("user-agent") || null,
  };
}

export function isContext(v: AdminApiContext | NextResponse): v is AdminApiContext {
  return !(v instanceof NextResponse);
}
