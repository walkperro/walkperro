const fs = require('fs');
const file = 'app/api/webhooks/stripe/route.ts';
let src = fs.readFileSync(file, 'utf8');

const replacement = String.raw`const html = \`
    <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;color:#0f172a;background:#0b1220;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="padding:20px 24px;">
          <h2 style="margin:0 0 8px;font-weight:800;letter-spacing:-0.02em;color:#0f172a">You’re in. ✅</h2>
          <p style="margin:0 0 16px;color:#334155">Thanks for your purchase! Your downloads are below.</p>
          <ul style="padding-left:18px;margin:0 0 16px;color:#0f172a;">
            \${resolved.map(r => r.url
              ? \`<li><strong>\${r.name}</strong> — <a href="\${r.url}" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline">Download</a></li>\`
              : \`<li><strong>\${r.name}</strong> — (no download link found)</li>\`).join("")}
          </ul>

          <div style="margin-top:16px;padding:16px;border-radius:16px;background:#ecfdf5;border:1px solid #a7f3d0;">
            <div style="font-weight:700;color:#064e3b;">Upgrade: All-In-One Toolkit</div>
            <div style="margin-top:4px;color:#065f46;">Every current & future digital drop in one sleek bundle.</div>
            <div style="margin-top:6px;color:#047857;">Use code <strong>DOG30</strong> for 30% off.</div>
            <a href="\${(process.env.NEXT_PUBLIC_SITE_URL||"https://walkperro.com")}/checkout?price=price_1SbmGUCCBLLo4EMcl3h2ZHKl&promotionCode=DOG30" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px;background:#10b981;color:#fff;padding:10px 14px;border-radius:999px;font-weight:600;text-decoration:none">Explore Bundle</a>
          </div>

          <p style="margin-top:16px;color:#334155;font-size:14px">Need help? DM <a style="color:#0ea5e9" href="https://instagram.com/walkperro">@walkperro</a> or email <a style="color:#0ea5e9" href="mailto:walkperro@proton.me">walkperro@proton.me</a>.</p>
        </div>
      </div>
    </div>\`;

  const sendRes`;

const re = /const html = `[\s\S]*?`;\s*const sendRes/;
if (!re.test(src)) {
  console.error('Pattern not found. Aborting without changes.');
  process.exit(1);
}
src = src.replace(re, replacement);
fs.writeFileSync(file, src);
console.log('Updated email HTML in', file);
