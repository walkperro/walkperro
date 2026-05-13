type Args = { resetUrl: string };

export function resetPasswordHtml({ resetUrl }: Args): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>reset your password</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=JetBrains+Mono&display=swap" rel="stylesheet" />
<style>
  body { margin:0; padding:0; background:#F5F1E8; color:#0E0E0E; }
  .wrap { max-width:540px; margin:0 auto; padding:48px 24px; }
  .label { font-family:"JetBrains Mono",ui-monospace,monospace; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#6B6B6B; }
  .h { font-family:"Instrument Serif",Georgia,serif; font-size:36px; line-height:1.05; letter-spacing:-0.02em; margin:16px 0; }
  .p { font-family:"Instrument Serif",Georgia,serif; font-size:18px; line-height:1.6; margin:16px 0; color:#1A1A1A; }
  .btn { display:inline-block; padding:12px 18px; font-family:"JetBrains Mono",ui-monospace,monospace; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; background:#0E0E0E; color:#F5F1E8 !important; text-decoration:none; border:1px solid #0E0E0E; }
  .hairline { border-top:1px solid #E5E0D2; margin:32px 0; }
  .sig { font-family:"JetBrains Mono",ui-monospace,monospace; font-size:12px; letter-spacing:0.08em; text-transform:lowercase; color:#6B6B6B; margin-top:32px; }
</style></head>
<body><div class="wrap">
  <p class="label">// admin — password reset</p>
  <h1 class="h">reset your password.</h1>
  <p class="p">click below to set a new password. this link expires in 1 hour and can be used once.</p>
  <p><a class="btn" href="${resetUrl}">RESET →</a></p>
  <p class="p">if you didn't request this, ignore this email — your password stays unchanged.</p>
  <div class="hairline"></div>
  <p class="sig">— walkperro / for the ones who do</p>
</div></body></html>`;
}
