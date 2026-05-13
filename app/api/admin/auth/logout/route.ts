import { NextRequest, NextResponse } from "next/server";
import { revokeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/sessions";
import { audit } from "@/lib/auth/audit";
import { getSessionUser } from "@/lib/auth/sessions";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await getSessionUser(token) : null;
  if (token) await revokeSession(token);
  if (user) {
    await audit(
      user.id,
      "logout",
      {},
      {
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        userAgent: req.headers.get("user-agent") || null,
      }
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
