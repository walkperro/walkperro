import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { generateBackupCodes } from "@/lib/auth/totp";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;

  const plaintextCodes = generateBackupCodes();
  const hashes = await Promise.all(plaintextCodes.map((c) => bcrypt.hash(c, 12)));

  await admin()
    .from("admin_users")
    .update({ backup_codes: hashes })
    .eq("id", ctx.user.id);

  await audit(ctx.user.id, "settings_changed", { what: "backup_codes_regenerated" }, { ip: ctx.ip, userAgent: ctx.userAgent });

  return NextResponse.json({ ok: true, backupCodes: plaintextCodes });
}
