import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { verifyCode, decryptSecret, generateBackupCodes } from "@/lib/auth/totp";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;

  const body = await req.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!code) return NextResponse.json({ ok: false, error: "missing_code" }, { status: 400 });

  const supa = admin();
  const { data: user } = await supa
    .from("admin_users")
    .select("totp_secret")
    .eq("id", ctx.user.id)
    .maybeSingle();
  if (!user?.totp_secret) {
    return NextResponse.json({ ok: false, error: "setup_not_started" }, { status: 400 });
  }

  const secret = decryptSecret(user.totp_secret);
  if (!verifyCode(secret, code)) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 401 });
  }

  // Generate backup codes, hash them, store hashes.
  const plaintextCodes = generateBackupCodes();
  const hashes = await Promise.all(plaintextCodes.map((c) => bcrypt.hash(c, 12)));

  await supa
    .from("admin_users")
    .update({ totp_enabled: true, backup_codes: hashes })
    .eq("id", ctx.user.id);

  await audit(ctx.user.id, "totp_setup", {}, { ip: ctx.ip, userAgent: ctx.userAgent });

  // Plaintext codes returned ONCE; client must show them and warn user to save.
  return NextResponse.json({ ok: true, backupCodes: plaintextCodes });
}
