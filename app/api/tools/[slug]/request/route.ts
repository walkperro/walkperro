import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { admin } from "@/lib/supabase/admin";
import { isEmail } from "@/lib/validation";
import { rateLimit, ipKey } from "@/lib/rate-limit";
import { getPublicTool, createDownloadRow } from "@/lib/tools-server";
import { downloadReadyHtml } from "@/lib/email/download-ready";
import { audit } from "@/lib/auth/audit";

const FROM = process.env.RESEND_FROM || "walkperro <walkperro@walkperro.com>";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { limited } = await rateLimit(ipKey(req.headers, `tool-req:${slug}`), {
      windowSeconds: 60,
      max: 10,
    });
    if (limited) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!isEmail(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });

    const tool = await getPublicTool(slug);
    if (!tool) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    if (tool.price_cents > 0) return NextResponse.json({ ok: false, error: "paid_tool" }, { status: 400 });

    const supa = admin();
    // Subscriber upsert
    let subscriberId: string | null = null;
    const { data: existing } = await supa
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existing) {
      subscriberId = existing.id;
    } else {
      const { data: inserted } = await supa
        .from("subscribers")
        .insert({ email, source: `tool:${slug}` })
        .select("id")
        .single();
      subscriberId = inserted?.id || null;
    }

    // If no file yet, just store waitlist intent and return 503
    if (!tool.file_path) {
      await audit(null, "tool_request", { tool: slug, email, waitlisted: true }, {
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      });
      return NextResponse.json({ ok: false, error: "no_file_yet" }, { status: 503 });
    }

    const dl = await createDownloadRow({ toolId: tool.id, email, subscriberId });
    if (!dl) return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });

    const appUrl = process.env.APP_URL || "https://www.walkperro.com";
    const downloadUrl = `${appUrl}/api/tools/download/${dl.token}`;

    // Send email best-effort
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: `your ${tool.title.toLowerCase()} download is ready.`,
          html: downloadReadyHtml({ toolTitle: tool.title, downloadUrl }),
        });
      } catch (e) {
        console.warn("TOOL_EMAIL_WARN", e);
      }
    }

    await audit(null, "tool_request", { tool: slug, email }, {
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("TOOL_REQUEST_ERROR", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
