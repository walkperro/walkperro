import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { admin } from "@/lib/supabase/admin";
import { isEmail } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { randomToken, sha256 } from "@/lib/encryption";
import { resetPasswordHtml } from "@/lib/email/reset-password";
import { audit } from "@/lib/auth/audit";

const FROM = process.env.RESEND_FROM || "walkperro <walkperro@walkperro.com>";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const { limited } = await rateLimit(`admin-forgot:${ip || "unknown"}`, {
      windowSeconds: 60 * 15,
      max: 5,
    });
    if (limited) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!isEmail(email)) {
      // Never reveal validity; always succeed
      return NextResponse.json({ ok: true });
    }

    const supa = admin();
    const { data: user } = await supa
      .from("admin_users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (user) {
      const raw = randomToken(32);
      const hash = sha256(raw);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      await supa.from("password_resets").insert({
        admin_user_id: user.id,
        token_hash: hash,
        expires_at: expiresAt,
      });

      await audit(user.id, "password_reset_request", {}, { ip, userAgent: req.headers.get("user-agent") });

      const appUrl = process.env.APP_URL || "https://www.walkperro.com";
      const resetUrl = `${appUrl}/admin/reset-password/${raw}`;

      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        try {
          const resend = new Resend(apiKey);
          await resend.emails.send({
            from: FROM,
            to: user.email,
            subject: "reset your walkperro admin password",
            html: resetPasswordHtml({ resetUrl }),
          });
        } catch (e) {
          console.warn("FORGOT_EMAIL_WARN", e);
        }
      }
    }

    // Always 200
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("FORGOT_ERROR", e);
    // Still 200 to avoid enumeration
    return NextResponse.json({ ok: true });
  }
}
