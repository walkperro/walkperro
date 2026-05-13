import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { hashPassword, verifyPassword, checkComplexity, isPwned } from "@/lib/auth/passwords";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;

  const body = await req.json().catch(() => ({}));
  const current = typeof body.current === "string" ? body.current : "";
  const next = typeof body.next === "string" ? body.next : "";
  if (!current || !next) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const complexity = checkComplexity(next);
  if (!complexity.ok) {
    return NextResponse.json({ ok: false, error: "weak_password", details: complexity.errors }, { status: 400 });
  }
  if (await isPwned(next)) {
    return NextResponse.json({ ok: false, error: "pwned_password" }, { status: 400 });
  }

  const supa = admin();
  const { data: user } = await supa
    .from("admin_users")
    .select("password_hash")
    .eq("id", ctx.user.id)
    .maybeSingle();
  if (!user || !(await verifyPassword(current, user.password_hash))) {
    return NextResponse.json({ ok: false, error: "wrong_current" }, { status: 401 });
  }

  const newHash = await hashPassword(next);
  await supa.from("admin_users").update({ password_hash: newHash }).eq("id", ctx.user.id);

  await audit(ctx.user.id, "password_change", {}, { ip: ctx.ip, userAgent: ctx.userAgent });
  return NextResponse.json({ ok: true });
}
