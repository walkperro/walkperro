// Welcome email HTML — bone bg, charcoal text, Instrument Serif via Google Fonts,
// max-width 540px, generous spacing. Brand-aligned, no fluff.

export function welcomeHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>you're in.</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
    <style>
      body { margin: 0; padding: 0; background: #F5F1E8; color: #0E0E0E; }
      .wrap { max-width: 540px; margin: 0 auto; padding: 48px 24px; }
      .label { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; }
      .h { font-family: "Instrument Serif", Georgia, serif; font-size: 40px; line-height: 1.05; letter-spacing: -0.02em; margin: 16px 0 8px; color: #0E0E0E; }
      .p { font-family: "Instrument Serif", Georgia, serif; font-size: 18px; line-height: 1.6; margin: 16px 0; color: #1A1A1A; }
      .hairline { border-top: 1px solid #E5E0D2; margin: 32px 0; }
      .sig { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: lowercase; color: #6B6B6B; margin-top: 32px; }
      a { color: #0E0E0E; text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <p class="label">// welcome</p>
      <h1 class="h">you're on the list.</h1>
      <p class="p">one post a week. tools, opinions, field notes. no fluff, no hype, no recycled twitter takes.</p>
      <p class="p">first drop hits tuesday.</p>
      <div class="hairline"></div>
      <p class="sig">— walkperro / for the ones who do</p>
      <p class="sig"><a href="https://www.walkperro.com">walkperro.com</a></p>
    </div>
  </body>
</html>`;
}

export function welcomeText(): string {
  return [
    "// welcome",
    "",
    "you're on the list.",
    "",
    "one post a week. tools, opinions, field notes.",
    "no fluff, no hype, no recycled twitter takes.",
    "",
    "first drop hits tuesday.",
    "",
    "— walkperro / for the ones who do",
    "https://www.walkperro.com",
  ].join("\n");
}
