import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

const STATUSES = new Set(["new", "building", "delivered", "live", "selling"]);

// Update an intake row's ops fields (status, notes).
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const update: Record<string, unknown> = {};
  if (typeof body.status === "string") {
    if (!STATUSES.has(body.status))
      return NextResponse.json({ ok: false, error: "bad_status" }, { status: 400 });
    update.status = body.status;
  }
  if (typeof body.notes === "string") update.notes = body.notes.slice(0, 4000);
  if (Object.keys(update).length === 0)
    return NextResponse.json({ ok: false, error: "no_fields" }, { status: 400 });

  const { data, error } = await admin()
    .from("intake_submissions")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();
  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await audit(ctx.user.id, "intake_update", { id, ...update });
  return NextResponse.json({ ok: true, row: data });
}
