import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { admin } from "@/lib/supabase/admin";
import { verifyCode, decryptSecret } from "@/lib/auth/totp";
import { createSession, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/sessions";
import { PENDING_COOKIE, verifyPendingToken } from "@/lib/auth/pending-totp";
import { recordFailedLogin, clearFailedLogin, getLockState } from "@/lib/auth/lockout";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const ua = req.headers.get("user-agent") || null;

    const pending = req.cookies.get(PENDING_COOKIE)?.value;
    const userId = verifyPendingToken(pending);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "pending_expired" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const useBackup = typeof body.backup === "string" ? body.backup.trim() : "";

    if (!code && !useBackup) {
      return NextResponse.json({ ok: false, error: "missing_code" }, { status: 400 });
    }

    const supa = admin();
    const { data: user } = await supa
      .from("admin_users")
      .select("id, totp_secret, totp_enabled, backup_codes")
      .eq("id", userId)
      .maybeSingle();

    if (!user || !user.totp_enabled || !user.totp_secret) {
      return NextResponse.json({ ok: false, error: "totp_unavailable" }, { status: 400 });
    }

    // Lock check
    const lock = await getLockState(userId);
    if (lock.locked) {
      return NextResponse.json(
        { ok: false, error: "locked", minutesRemaining: lock.minutesRemaining },
        { status: 423 }
      );
    }

    let ok = false;
    let backupUsed = false;

    if (code) {
      const secret = decryptSecret(user.totp_secret);
      ok = verifyCode(secret, code);
    } else if (useBackup) {
      // Try each hashed backup code; if a match, remove it.
      const codes: string[] = user.backup_codes || [];
      for (let i = 0; i < codes.length; i++) {
        const match = await bcrypt.compare(useBackup.toUpperCase(), codes[i]);
        if (match) {
          const remaining = codes.filter((_, j) => j !== i);
          await supa.from("admin_users").update({ backup_codes: remaining }).eq("id", userId);
          ok = true;
          backupUsed = true;
          break;
        }
      }
    }

    if (!ok) {
      await recordFailedLogin(userId);
      await audit(userId, "totp_failed", {}, { ip, userAgent: ua });
      return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 401 });
    }

    await clearFailedLogin(userId);
    await supa
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString(), last_login_ip: ip })
      .eq("id", userId);

    const { rawToken } = await createSession({ userId, ip, userAgent: ua });
    await audit(userId, "login", { totp: true, backup: backupUsed }, { ip, userAgent: ua });

    const res = NextResponse.json({ ok: true, step: "done", backupUsed });
    res.cookies.set(SESSION_COOKIE, rawToken, sessionCookieOptions());
    res.cookies.set(PENDING_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    return res;
  } catch (e) {
    console.error("LOGIN_TOTP_ERROR", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
