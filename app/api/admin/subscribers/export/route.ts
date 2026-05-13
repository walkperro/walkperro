import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: NextRequest) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;

  const { data, error } = await admin()
    .from("subscribers")
    .select("email, source, status, tags, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const header = "email,source,status,tags,created_at";
  const rows = (data || []).map((r) =>
    [r.email, r.source, r.status, (r.tags || []).join("|"), r.created_at].map(csvEscape).join(",")
  );
  const csv = [header, ...rows].join("\n");

  await audit(ctx.user.id, "subscriber_exported", { count: rows.length }, { ip: ctx.ip, userAgent: ctx.userAgent });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="walkperro-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
