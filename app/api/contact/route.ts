import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isRateLimited } from "@/lib/ratelimit";

const resend = new Resend(process.env.RESEND_API_KEY);

// simple honeypot checker
const isSpam = (v: any) =>
  typeof v?.website === "string" && v.website.trim().length > 0;

export async function POST(request: Request) {
  try {
    // identify client
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (await isRateLimited(`contact:${ip}`)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const { name, email, message, website } = await request.json();

    if (isSpam({ website })) {
      // silently accept bots
      return NextResponse.json({ ok: true });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("Missing RESEND_API_KEY");
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const from = process.env.RESEND_FROM || "onboarding@resend.dev";
    const to =
      process.env.NOTIFY_SIGNUPS_TO ||
      process.env.RESEND_FROM ||
      "hello@walkperro.com";

    await resend.emails.send({
      from,
      to,
      subject: `New WalkPerro inquiry from ${name || "Unknown"}`,
      replyTo: email,
      html: `
        <h2>New Inquiry</h2>
        <p><b>Name:</b> ${name || ""}</p>
        <p><b>Email:</b> ${email || ""}</p>
        <p><b>Message:</b></p>
        <p>${(message || "").replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
