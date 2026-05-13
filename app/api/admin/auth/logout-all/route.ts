import { NextRequest, NextResponse } from "next/server";
import { revokeAllForUser, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/sessions";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  await revokeAllForUser(ctx.user.id);
  await audit(ctx.user.id, "logout_all", {}, { ip: ctx.ip, userAgent: ctx.userAgent });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
