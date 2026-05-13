import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { getSignedFileUrl } from "@/lib/tools-server";
import { audit } from "@/lib/auth/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supa = admin();
    const { data: dl } = await supa
      .from("tool_downloads")
      .select("id, tool_id, email, token_expires_at, downloaded_at, amount_paid_cents")
      .eq("download_token", token)
      .maybeSingle();

    if (!dl) {
      return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 404 });
    }
    if (new Date(dl.token_expires_at) < new Date()) {
      return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
    }
    // Paid downloads are single-use; free are multi-use within 24h.
    if (dl.amount_paid_cents > 0 && dl.downloaded_at) {
      return NextResponse.json({ ok: false, error: "already_used" }, { status: 410 });
    }

    const { data: tool } = await supa.from("tools").select("file_path, title, download_count").eq("id", dl.tool_id).maybeSingle();
    if (!tool?.file_path) {
      return NextResponse.json({ ok: false, error: "file_missing" }, { status: 503 });
    }

    const signed = await getSignedFileUrl(tool.file_path);
    if (!signed) return NextResponse.json({ ok: false, error: "signed_url_failed" }, { status: 500 });

    // Mark used + bump download count
    await supa.from("tool_downloads").update({ downloaded_at: new Date().toISOString() }).eq("id", dl.id);
    await supa.from("tools").update({ download_count: (tool.download_count || 0) + 1 }).eq("id", dl.tool_id);

    await audit(null, "tool_download", { tool_id: dl.tool_id, email: dl.email }, {
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    });

    return NextResponse.redirect(signed, 302);
  } catch (e) {
    console.error("TOOL_DOWNLOAD_ERROR", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
