import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { sha256 } from "@/lib/encryption";
import { hashPassword, checkComplexity, isPwned } from "@/lib/auth/passwords";
import { revokeAllForUser } from "@/lib/auth/sessions";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token || !password) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const complexity = checkComplexity(password);
    if (!complexity.ok) {
      return NextResponse.json({ ok: false, error: "weak_password", details: complexity.errors }, { status: 400 });
    }
    if (await isPwned(password)) {
      return NextResponse.json({ ok: false, error: "pwned_password" }, { status: 400 });
    }

    const supa = admin();
    const tokenHash = sha256(token);
    const { data: reset } = await supa
      .from("password_resets")
      .select("id, admin_user_id, expires_at, used_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (!reset || reset.used_at || new Date(reset.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, error: "invalid_or_expired" }, { status: 401 });
    }

    const newHash = await hashPassword(password);
    await supa
      .from("admin_users")
      .update({ password_hash: newHash, failed_login_count: 0, locked_until: null })
      .eq("id", reset.admin_user_id);

    await supa
      .from("password_resets")
      .update({ used_at: new Date().toISOString() })
      .eq("id", reset.id);

    // Revoke all existing sessions for safety.
    await revokeAllForUser(reset.admin_user_id);

    await audit(
      reset.admin_user_id,
      "password_reset_complete",
      {},
      {
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        userAgent: req.headers.get("user-agent"),
      }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RESET_ERROR", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
