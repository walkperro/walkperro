import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isRateLimited } from "@/lib/ratelimit";

// Inquiry route for the /websites catalog. Validates the payload, rejects
// spammers via the `website` honeypot, sends a Resend email to
// walkperro@proton.me with all the form fields and a reply-to set to the
// prospect's email so Walk can hit reply directly.
//
// Mirrors the pattern in app/api/contact/route.ts.

const TO_EMAIL = "walkperro@proton.me";

const isSpam = (v: any) =>
  typeof v?.website === "string" && v.website.trim().length > 0;

function esc(s: string) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (await isRateLimited(`websites-inquiry:${ip}`)) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      topic: rawTopic,
      templateSlug,
      templateTitle,
      email,
      name,
      business,
      project,
      budget,
      phone,
      website, // honeypot
    } = body || {};

    // topic is additive — legacy payloads without it are "website".
    const topic = ["website", "bot", "course"].includes(rawTopic)
      ? rawTopic
      : "website";

    // Silently accept honeypot hits — bots get no signal.
    if (isSpam({ website })) {
      return NextResponse.json({ ok: true });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 }
      );
    }
    if (!templateSlug || typeof templateSlug !== "string") {
      return NextResponse.json(
        { ok: false, error: "missing_template" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("Missing RESEND_API_KEY");
      return NextResponse.json(
        { ok: false, error: "not_configured" },
        { status: 503 }
      );
    }
    const resend = new Resend(apiKey);

    const from = process.env.RESEND_FROM || "onboarding@resend.dev";

    const subject = `// ${topic} inquiry — ${templateTitle || templateSlug}`;
    const lines: string[] = [];
    lines.push(`<h2>// ${esc(topic)} inquiry</h2>`);
    lines.push(`<p><b>re:</b> ${esc(templateTitle || templateSlug)} <code>(${esc(templateSlug)})</code></p>`);
    lines.push(`<hr>`);
    lines.push(`<p><b>email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p>`);
    if (name) lines.push(`<p><b>name:</b> ${esc(name)}</p>`);
    if (business) lines.push(`<p><b>business:</b> ${esc(business)}</p>`);
    if (budget) lines.push(`<p><b>budget:</b> ${esc(budget)}</p>`);
    if (phone) lines.push(`<p><b>phone:</b> ${esc(phone)}</p>`);
    if (project) {
      lines.push(`<p><b>project:</b></p>`);
      lines.push(`<p>${esc(project).replace(/\n/g, "<br>")}</p>`);
    }
    lines.push(`<hr>`);
    lines.push(`<p style="color:#888;font-size:12px;">ip: ${esc(ip)} · source: /websites/${esc(templateSlug)}</p>`);

    await resend.emails.send({
      from,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      html: lines.join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("websites-inquiry error:", error);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 500 }
    );
  }
}
