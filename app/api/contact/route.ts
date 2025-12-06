import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Optional: simple spam honeypot. If filled, ignore.
function isSpam(form: Record<string, any>) {
  return typeof form.website === "string" && form.website.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const { name, email, message, website } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      console.warn("Missing RESEND_API_KEY");
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    if (isSpam({ website })) {
      return NextResponse.json({ ok: true }); // silently succeed
    }

    const from = process.env.RESEND_FROM || "onboarding@resend.dev";
    const to =
      process.env.NOTIFY_SIGNUPS_TO ||
      process.env.RESEND_FROM ||
      "hello@walkperro.com";

    await resend.emails.send({
      from,
      to,
      subject: `New WalkPerro inquiry from ${name}`,
      reply_to: email,
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
