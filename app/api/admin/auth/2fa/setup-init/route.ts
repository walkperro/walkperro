import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { generateSecret, provisionUri, qrDataUrl, encryptSecret } from "@/lib/auth/totp";

export async function POST(req: NextRequest) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;

  const secret = generateSecret();
  const uri = provisionUri(ctx.user.email, secret);
  const qr = await qrDataUrl(uri);

  // Store encrypted, tentative (do NOT flip totp_enabled yet)
  await admin()
    .from("admin_users")
    .update({ totp_secret: encryptSecret(secret) })
    .eq("id", ctx.user.id);

  return NextResponse.json({ ok: true, qr, uri });
}
