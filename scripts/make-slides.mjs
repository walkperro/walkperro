#!/usr/bin/env node
// WalkPerro slide generator — renders a slides.json carousel to PNGs.
// Spec: docs/slide-format.md (and the v1 spec the operator pasted).
//
// Usage:
//   node scripts/make-slides.mjs path/to/slides.json
// Optional env:
//   SLIDES_OUTPUT_DIR=/tmp/wp-out   (default)
//
// Output:
//   <SLIDES_OUTPUT_DIR>/<post_slug>/slide-NN.png
//
// Implementation: SVG strings → sharp() → PNG. Fonts embedded as base64 data URLs
// in @font-face so librsvg picks them up without system-level installation.

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

// ── canvas + tokens ────────────────────────────────────────────────────────
const W = 1080;
const H = 1350;
const PAD = 72;
const COLOR = {
  signal:   "#EBFF00",
  charcoal: "#0E0E0E",
  bone:     "#F5F1E8",
};

// ── font loading ───────────────────────────────────────────────────────────
const FONT_DIR = path.resolve("assets/fonts");
const FONT_FILES = [
  path.join(FONT_DIR, "InstrumentSerif-Regular.ttf"),
  path.join(FONT_DIR, "InstrumentSerif-Italic.ttf"),
  path.join(FONT_DIR, "JetBrainsMono-Regular.ttf"),
  path.join(FONT_DIR, "JetBrainsMono-Bold.ttf"),
];
// @font-face not needed — resvg-js loads fonts via API (fontFiles option below)
const fontFaceCss = "";

// ── text helpers ───────────────────────────────────────────────────────────
// Char-width estimates (empirically calibrated per font family).
// Returns avg char width in fontSize units.
// Char-width factors empirically calibrated against rendered Instrument Serif
// and JetBrains Mono at display sizes. Used for word-wrap + auto-size decisions only.
function charWidth(family, italic = false) {
  if (family === "serif") return italic ? 0.40 : 0.42;
  return 0.605; // mono is fixed-pitch ~0.6
}

// Wrap text into lines that fit within maxWidthPx at the given fontSize.
// Respects pre-existing \n line breaks (treats them as hard wraps).
function wrapText(text, fontSize, maxWidthPx, family = "serif", italic = false) {
  const cw = fontSize * charWidth(family, italic);
  const result = [];
  for (const paragraph of text.split("\n")) {
    if (paragraph.trim() === "") { result.push(""); continue; }
    const words = paragraph.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (test.length * cw <= maxWidthPx) {
        line = test;
      } else {
        if (line) result.push(line);
        line = w;
      }
    }
    if (line) result.push(line);
  }
  return result;
}

// Find the largest font size that fits `text` into a (maxWidth, maxHeight) box.
function autoSize(text, opts) {
  const { min, max, step = 4, maxWidth, maxHeight, family = "serif", italic = false, lineHeightFactor = 1.18 } = opts;
  for (let fs = max; fs >= min; fs -= step) {
    const lines = wrapText(text, fs, maxWidth, family, italic);
    const totalH = lines.length * fs * lineHeightFactor;
    if (totalH <= maxHeight) return { fontSize: fs, lines };
  }
  // Fallback: render at min even if it overflows
  const lines = wrapText(text, min, maxWidth, family, italic);
  return { fontSize: min, lines };
}

// XML-escape for embedding text into SVG
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// Render an array of lines as <text> elements, top-aligned at startY, left-aligned at x.
function renderLines(lines, opts) {
  const { x, startY, fontSize, family, weight = "400", italic = false, fill, anchor = "start", lineHeightFactor = 1.18 } = opts;
  const dy = fontSize * lineHeightFactor;
  return lines.map((line, i) => {
    const y = startY + i * dy;
    return `<text x="${x}" y="${y}" font-family="${family}" font-size="${fontSize}" font-weight="${weight}" font-style="${italic ? "italic" : "normal"}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="alphabetic">${esc(line)}</text>`;
  }).join("\n");
}

// ── chrome (header + footer) ───────────────────────────────────────────────
// Per spec:
//   walkperro mono reg 28pt at (72,72) lowercase
//   slide counter right-aligned to padding edge, baseline matches wordmark
//   hairline 2px solid charcoal full-width-minus-padding at y=130
//   category label // FIELD NOTE mono bold 24pt at (72,170)
//   footer FOR THE ONES WHO DO. mono bold 26pt centered at y = H-130
// Note: SVG <text y> is the baseline. To put a 28pt cap-height-ish label at "y=72" in the spec
// (top of glyph), shift baseline down by ~font ascent (~0.75 * fontSize ≈ 21px).
function drawChrome({ index, total, category, hairlineColor = COLOR.charcoal, textColor = COLOR.charcoal }) {
  // Originals use Bold mono for all chrome (wordmark, slide counter, category, footer).
  // Sizes calibrated from /tmp/wp-slides/post2-slide-01.png.
  const wordmarkFs = 32;
  const wordmarkBaseline = 76 + wordmarkFs * 0.76;
  const categoryFs = 28;
  const footerFs = 32;
  return `
<!-- header -->
<text x="${PAD}" y="${wordmarkBaseline}" font-family="JetBrains Mono" font-size="${wordmarkFs}" font-weight="700" fill="${textColor}" dominant-baseline="alphabetic">walkperro</text>
<text x="${W - PAD}" y="${wordmarkBaseline}" font-family="JetBrains Mono" font-size="${wordmarkFs}" font-weight="700" fill="${textColor}" text-anchor="end" dominant-baseline="alphabetic">${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text>

<!-- hairline -->
<line x1="${PAD}" y1="140" x2="${W - PAD}" y2="140" stroke="${hairlineColor}" stroke-width="2"/>

<!-- category -->
<text x="${PAD}" y="${180 + categoryFs * 0.76}" font-family="JetBrains Mono" font-size="${categoryFs}" font-weight="700" fill="${textColor}" dominant-baseline="alphabetic">${esc(category)}</text>

<!-- footer -->
<text x="${W / 2}" y="${H - 110}" font-family="JetBrains Mono" font-size="${footerFs}" font-weight="700" fill="${textColor}" text-anchor="middle" dominant-baseline="alphabetic">FOR THE ONES WHO DO.</text>
`;
}

// CTA footer add-on: hairline + handle + URL above the standard footer
function drawCtaFooter({ handle, url, textColor = COLOR.charcoal, hairlineColor = COLOR.charcoal }) {
  const handleBaseline = (H - 250) + 28 * 0.78;
  const urlBaseline = (H - 210) + 24 * 0.78;
  return `
<line x1="${PAD}" y1="${H - 290}" x2="${W - PAD}" y2="${H - 290}" stroke="${hairlineColor}" stroke-width="2"/>
<text x="${PAD}" y="${handleBaseline}" font-family="JetBrains Mono" font-size="28" font-weight="700" fill="${textColor}" dominant-baseline="alphabetic">${esc(handle || "@WALKPERRO")}</text>
<text x="${PAD}" y="${urlBaseline}" font-family="JetBrains Mono" font-size="24" font-weight="400" fill="${textColor}" dominant-baseline="alphabetic">${esc(url || "walkperro.com / log")}</text>
`;
}

// ── layout: OPEN (big serif on yellow) ─────────────────────────────────────
// Body region: x=90 to W-90, y=320 to y=H-220. Left-aligned. Vertically centered.
// Auto-size 52pt min → 140pt max.
function layoutOpen({ text, fill = COLOR.charcoal, min = 60, max = 180 }) {
  // Sizes calibrated against post1-slide-01 + post2-slide-07 originals.
  const xLeft = 90;
  const yTop = 295;
  const yBot = H - 200;
  const maxWidth = W - 90 - xLeft;
  const maxHeight = yBot - yTop;
  const fit = autoSize(text, { min, max, maxWidth, maxHeight, family: "serif", lineHeightFactor: 1.10 });
  const dy = fit.fontSize * 1.10;
  const totalH = fit.lines.length * dy;
  const firstBaseline = yTop + (maxHeight - totalH) / 2 + fit.fontSize * 0.82;
  return renderLines(fit.lines, {
    x: xLeft,
    startY: firstBaseline,
    fontSize: fit.fontSize,
    family: "Instrument Serif",
    weight: "400",
    italic: false,
    fill,
    lineHeightFactor: 1.10,
  });
}

// ── layout: EDGE-BLEED (charcoal band, serif in bone) ──────────────────────
// Band y=260 to y=H-230, full bleed x=0 to W. 90px inner padding L/R. Text vertically centered.
// Auto-size 44pt → 110pt.
function layoutEdgeBleed({ text, min = 44, max = 110 }) {
  const bandTop = 245;
  const bandBot = H - 195;
  const innerPad = 90;
  const xLeft = innerPad;
  const maxWidth = W - innerPad * 2;
  const innerVPad = 60;
  const maxHeight = (bandBot - bandTop) - innerVPad * 2;
  const fit = autoSize(text, { min, max, maxWidth, maxHeight, family: "serif" });
  const dy = fit.fontSize * 1.18;
  const totalH = fit.lines.length * dy;
  const firstBaseline = bandTop + innerVPad + ((bandBot - bandTop) - innerVPad * 2 - totalH) / 2 + fit.fontSize * 0.82;
  const band = `<rect x="0" y="${bandTop}" width="${W}" height="${bandBot - bandTop}" fill="${COLOR.charcoal}"/>`;
  const body = renderLines(fit.lines, {
    x: xLeft,
    startY: firstBaseline,
    fontSize: fit.fontSize,
    family: "InstrumentSerif",
    weight: "400",
    fill: COLOR.bone,
  });
  return band + "\n" + body;
}

// ── layout: STATS ──────────────────────────────────────────────────────────
// Open layout. Top mono small label, then 1-3 stacked groups (big serif + mono label).
function layoutStats({ top_label, groups }) {
  // Calibrated against post2-slide-01 original.
  // Top label is mono bold uppercase, sits at y~290.
  // Each group: massive serif number (~220pt for 3-group), then mono label below,
  // tightly packed without uniform slot heights.
  const xLeft = 90;
  const yTopLabel = 285;
  const labelFs = 32;
  const labelBaseline = yTopLabel + labelFs * 0.82;
  let svg = `<text x="${xLeft}" y="${labelBaseline}" font-family="JetBrains Mono" font-size="${labelFs}" font-weight="700" fill="${COLOR.charcoal}" dominant-baseline="alphabetic">${esc(top_label || "")}</text>`;

  // After top label, stack groups tightly. Each number is auto-sized to fill remaining space.
  const numFs = groups.length <= 1 ? 240 : groups.length === 2 ? 220 : 200;
  const subFs = 30;
  const gapNumToSub = 14;
  const gapGroupToGroup = 60;

  // Start groups directly under the top label
  let cursorY = labelBaseline + labelFs * 0.4 + 40; // baseline of top label + gap

  groups.forEach((g, i) => {
    const numBaseline = cursorY + numFs * 0.82;
    svg += `\n<text x="${xLeft}" y="${numBaseline}" font-family="Instrument Serif" font-size="${numFs}" font-weight="400" fill="${COLOR.charcoal}" dominant-baseline="alphabetic">${esc(g.value)}</text>`;
    const subBaseline = numBaseline + gapNumToSub + subFs * 0.82;
    svg += `\n<text x="${xLeft}" y="${subBaseline}" font-family="JetBrains Mono" font-size="${subFs}" font-weight="400" fill="${COLOR.charcoal}" dominant-baseline="alphabetic">${esc(g.label)}</text>`;
    cursorY = subBaseline + gapGroupToGroup;
  });

  return svg;
}

// ── layout: PROMPT (edge-bleed band, mono body) ───────────────────────────
function layoutPrompt({ sublabel, text }) {
  const bandTop = 245;
  const bandBot = H - 195;
  const innerPad = 90;
  const xLeft = innerPad;
  const maxWidth = W - innerPad * 2;
  const innerVPad = 60;

  const subFs = 24;
  const subBaseline = bandTop + innerVPad + subFs * 0.82;

  const bodyTop = subBaseline + 32;
  const maxHeight = (bandBot - innerVPad) - bodyTop;
  const fit = autoSize(text, { min: 20, max: 30, step: 1, maxWidth, maxHeight, family: "mono" });
  const dy = fit.fontSize * 1.4;
  const firstBaseline = bodyTop + fit.fontSize * 0.82;

  const band = `<rect x="0" y="${bandTop}" width="${W}" height="${bandBot - bandTop}" fill="${COLOR.charcoal}"/>`;
  const sub = `<text x="${xLeft}" y="${subBaseline}" font-family="JetBrains Mono" font-size="${subFs}" font-weight="700" fill="${COLOR.signal}" dominant-baseline="alphabetic">${esc(sublabel)}</text>`;

  const body = fit.lines.map((line, i) => {
    const y = firstBaseline + i * dy;
    return `<text x="${xLeft}" y="${y}" font-family="JetBrains Mono" font-size="${fit.fontSize}" font-weight="400" fill="${COLOR.bone}" dominant-baseline="alphabetic">${esc(line)}</text>`;
  }).join("\n");

  return band + "\n" + sub + "\n" + body;
}

// ── layout: CHECKLIST (edge-bleed band, serif list items with arrow prefix) ─
function layoutChecklist({ sublabel, items }) {
  const bandTop = 245;
  const bandBot = H - 195;
  const innerPad = 90;
  const xLeft = innerPad;

  const subFs = 24;
  const subBaseline = bandTop + 60 + subFs * 0.82;

  const itemFs = 50;
  const lineHeight = 95; // per spec
  // Total height of all items
  const itemsTotalH = items.length * lineHeight;
  // Center the items group between subBaseline+60 and bandBot-60
  const itemsRegionTop = subBaseline + 70;
  const itemsRegionBot = bandBot - 60;
  const itemsBlockTop = itemsRegionTop + Math.max(0, (itemsRegionBot - itemsRegionTop - itemsTotalH) / 2);

  const band = `<rect x="0" y="${bandTop}" width="${W}" height="${bandBot - bandTop}" fill="${COLOR.charcoal}"/>`;
  const sub = `<text x="${xLeft}" y="${subBaseline}" font-family="JetBrains Mono" font-size="${subFs}" font-weight="700" fill="${COLOR.signal}" dominant-baseline="alphabetic">${esc(sublabel)}</text>`;

  // The arrow glyph isn't in Instrument Serif → fall back would swap the whole
  // run to mono. Render arrow in JetBrains Mono and item body in Instrument Serif
  // as two text elements sharing a baseline.
  const arrowFs = Math.round(itemFs * 0.6);
  const arrowOffset = arrowFs * 2.0; // x-shift for item body after arrow
  const list = items.map((item, i) => {
    const y = itemsBlockTop + i * lineHeight + itemFs * 0.82;
    const arrowY = itemsBlockTop + i * lineHeight + arrowFs * 0.82 + (itemFs - arrowFs) * 0.4;
    const arrow = `<text x="${xLeft}" y="${arrowY}" font-family="JetBrains Mono" font-size="${arrowFs}" font-weight="400" fill="${COLOR.bone}" dominant-baseline="alphabetic">→</text>`;
    const body = `<text x="${xLeft + arrowOffset}" y="${y}" font-family="Instrument Serif" font-size="${itemFs}" font-weight="400" fill="${COLOR.bone}" dominant-baseline="alphabetic">${esc(item)}</text>`;
    return arrow + "\n" + body;
  }).join("\n");

  return band + "\n" + sub + "\n" + list;
}

// ── layout: CTA (open variant with italic sub) ─────────────────────────────
// text: hook (serif). subtext: italic. Then CTA footer block.
function layoutCta({ text, sub }) {
  const xLeft = 90;
  const yTop = 320;
  const yBot = H - 330; // leave room for CTA footer
  const maxWidth = W - 90 - xLeft;

  // If sub provided, give it ~120px in this region; the hook gets the rest.
  const hookMax = sub ? (yBot - yTop) - 200 : (yBot - yTop);
  const hookFit = autoSize(text, { min: 60, max: 150, maxWidth, maxHeight: hookMax, family: "serif" });
  const hookDy = hookFit.fontSize * 1.15;
  const hookH = hookFit.lines.length * hookDy;

  const hookBaseline0 = yTop + hookFit.fontSize * 0.82;
  const hook = renderLines(hookFit.lines, {
    x: xLeft,
    startY: hookBaseline0,
    fontSize: hookFit.fontSize,
    family: "InstrumentSerif",
    fill: COLOR.charcoal,
    lineHeightFactor: 1.15,
  });

  let subSvg = "";
  if (sub) {
    const subTop = yTop + hookH + 30;
    const subFit = autoSize(sub, {
      min: 40, max: 80, maxWidth, maxHeight: yBot - subTop, family: "serif", italic: true, lineHeightFactor: 1.25,
    });
    const subBaseline0 = subTop + subFit.fontSize * 0.82;
    subSvg = renderLines(subFit.lines, {
      x: xLeft,
      startY: subBaseline0,
      fontSize: subFit.fontSize,
      family: "InstrumentSerif",
      italic: true,
      fill: COLOR.charcoal,
      lineHeightFactor: 1.25,
    });
  }
  return hook + "\n" + subSvg;
}

// ── slide dispatcher ──────────────────────────────────────────────────────
function buildSlide({ slide, category, total }) {
  const bg = COLOR.signal; // default; charcoal/yellow bands handled inside layout
  let body = "";
  switch (slide.type) {
    case "cover":
      body = layoutOpen({ text: slide.text });
      break;
    case "body":
      body = slide.layout === "edge_bleed"
        ? layoutEdgeBleed({ text: slide.text })
        : layoutOpen({ text: slide.text });
      break;
    case "stats":
      body = layoutStats({ top_label: slide.top_label, groups: slide.groups });
      break;
    case "prompt":
      body = layoutPrompt({ sublabel: slide.sublabel || "// THE PROMPT", text: slide.text });
      break;
    case "checklist":
      body = layoutChecklist({ sublabel: slide.sublabel || "// WHAT CLAUDE BUILT", items: slide.items });
      break;
    case "cta":
      body = layoutCta({ text: slide.text, sub: slide.sub });
      break;
    default:
      body = layoutOpen({ text: slide.text || "" });
  }

  const isCta = slide.type === "cta";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${fontFaceCss}
<rect width="${W}" height="${H}" fill="${bg}"/>
${body}
${drawChrome({ index: slide.index, total, category })}
${isCta ? drawCtaFooter({ handle: slide.handle, url: slide.url }) : ""}
</svg>`;
}

// ── CLI ───────────────────────────────────────────────────────────────────
async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node scripts/make-slides.mjs <slides.json>");
    process.exit(1);
  }
  const spec = JSON.parse(readFileSync(arg, "utf8"));
  const outDir = path.join(process.env.SLIDES_OUTPUT_DIR || "/tmp/wp-out", spec.post_slug);
  mkdirSync(outDir, { recursive: true });

  console.log(`Rendering ${spec.slides.length} slides → ${outDir}`);
  for (const slide of spec.slides) {
    const svg = buildSlide({ slide, category: spec.category, total: spec.total_slides || spec.slides.length });
    const num = String(slide.index).padStart(2, "0");
    const out = path.join(outDir, `slide-${num}.png`);
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: W },
      font: {
        fontFiles: FONT_FILES,
        loadSystemFonts: false,
        defaultFontFamily: "JetBrains Mono",
      },
      background: COLOR.signal,
    });
    writeFileSync(out, resvg.render().asPng());
    console.log(`  ✓ slide-${num}.png`);
  }
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
