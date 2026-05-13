// Download-ready email — "your tool is ready" with a one-time link.

type Args = {
  toolTitle: string;
  downloadUrl: string;
  expiresIn?: string; // e.g. "24 hours"
};

export function downloadReadyHtml({ toolTitle, downloadUrl, expiresIn = "24 hours" }: Args): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>your download is ready.</title>
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
  <p class="label">// download — ready</p>
  <h1 class="h">${escapeHtml(toolTitle)}</h1>
  <p class="p">your download link is live for the next ${expiresIn}. one click and you're in.</p>
  <p><a class="btn" href="${downloadUrl}">DOWNLOAD →</a></p>
  <div class="hairline"></div>
  <p class="sig">— walkperro / for the ones who do</p>
</div></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c] as string));
}
