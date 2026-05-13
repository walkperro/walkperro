import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { isEmail } from "@/lib/validation";
import { verifyPassword } from "@/lib/auth/passwords";
import { getLockState, recordFailedLogin, clearFailedLogin } from "@/lib/auth/lockout";
import { createSession, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/sessions";
import { createPendingToken, PENDING_COOKIE, pendingCookieOptions } from "@/lib/auth/pending-totp";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const ua = req.headers.get("user-agent") || null;

    // Global IP rate limit on /login
    const ipLimit = await rateLimit(`admin-login:ip:${ip || "unknown"}`, {
      windowSeconds: 60 * 15,
      max: 20,
    });
    if (ipLimit.limited) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!isEmail(email) || !password) {
      return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 400 });
    }

    // Per-email rate limit (independent of IP)
    const emailLimit = await rateLimit(`admin-login:email:${email}`, {
      windowSeconds: 60 * 15,
      max: 10,
    });
    if (emailLimit.limited) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const supa = admin();
    const { data: user } = await supa
      .from("admin_users")
      .select("id, email, password_hash, totp_enabled, locked_until")
      .eq("email", email)
      .maybeSingle();

    // Constant-time-ish: always run verifyPassword even if user missing
    const valid = user
      ? await verifyPassword(password, user.password_hash)
      : await verifyPassword(password, "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi");

    if (!user || !valid) {
      if (user) await recordFailedLogin(user.id);
      await audit(user?.id || null, "login_failed", { email }, { ip, userAgent: ua });
      return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
    }

    // Lock check
    const lock = await getLockState(user.id);
    if (lock.locked) {
      await audit(user.id, "login_locked", { minutesRemaining: lock.minutesRemaining }, { ip, userAgent: ua });
      return NextResponse.json(
        { ok: false, error: "locked", minutesRemaining: lock.minutesRemaining },
        { status: 423 }
      );
    }

    // If TOTP enabled, issue a pending token and return step='totp'
    if (user.totp_enabled) {
      const cookieValue = createPendingToken(user.id);
      const res = NextResponse.json({ ok: true, step: "totp" });
      res.cookies.set(PENDING_COOKIE, cookieValue, pendingCookieOptions());
      return res;
    }

    // No TOTP yet → complete login but require setup.
    await clearFailedLogin(user.id);
    await supa
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString(), last_login_ip: ip })
      .eq("id", user.id);

    const { rawToken } = await createSession({ userId: user.id, ip, userAgent: ua });
    await audit(user.id, "login", { totp: false }, { ip, userAgent: ua });

    const res = NextResponse.json({ ok: true, step: "setup-2fa" });
    res.cookies.set(SESSION_COOKIE, rawToken, sessionCookieOptions());
    return res;
  } catch (e) {
    console.error("LOGIN_ERROR", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
