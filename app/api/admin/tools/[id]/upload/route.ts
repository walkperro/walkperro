import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

const BUCKET = "tools";
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  const { id } = await params;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "missing_file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 413 });
  }

  const supa = admin();
  const { data: tool } = await supa.from("tools").select("slug").eq("id", id).maybeSingle();
  if (!tool) return NextResponse.json({ ok: false, error: "tool_not_found" }, { status: 404 });

  const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const filePath = `${tool.slug}/${Date.now()}${ext}`;

  const arrayBuf = await file.arrayBuffer();
  const { error: uploadErr } = await supa.storage
    .from(BUCKET)
    .upload(filePath, new Uint8Array(arrayBuf), {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });
  if (uploadErr) {
    return NextResponse.json({ ok: false, error: `upload_failed: ${uploadErr.message}` }, { status: 500 });
  }

  await supa.from("tools").update({ file_path: filePath }).eq("id", id);
  await audit(ctx.user.id, "tool_uploaded", { id, path: filePath, size: file.size }, { ip: ctx.ip, userAgent: ctx.userAgent });

  return NextResponse.json({ ok: true, file_path: filePath });
}

// Body parsing is not configured here; Next.js App Router routes accept
// multipart/form-data natively via req.formData(), which we use above.
export const runtime = "nodejs";
