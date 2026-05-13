// Generate favicon set from public/brand/wp_logo_1.png.
// The source has the "W" glyph in the bottom-right of a yellow 1024×1024 canvas.
// We crop to a square around the W (with a small margin) and emit PNG icons.

import sharp from "sharp";
import { writeFileSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve("public/brand/wp_logo_1.png");
const APP = path.resolve("app");
const PUBLIC = path.resolve("public");

// Crop region — the W sits in the bottom-right. We center on it with margin.
// Tuned from visual inspection of /public/brand/wp_logo_1.png.
const CROP = { left: 720, top: 700, width: 304, height: 304 };

async function main() {
  // Master square (W centered with yellow padding)
  const master = await sharp(SRC).extract(CROP).resize(512, 512).png().toBuffer();

  // Sizes for various contexts
  const targets = [
    { out: path.join(APP, "icon.png"), size: 32 },         // Next.js auto-picks app/icon.png as the favicon
    { out: path.join(APP, "apple-icon.png"), size: 180 },  // Apple touch icon
    { out: path.join(PUBLIC, "icon-192.png"), size: 192 }, // PWA
    { out: path.join(PUBLIC, "icon-512.png"), size: 512 }, // PWA large
    { out: path.join(PUBLIC, "og-square.png"), size: 1200 }, // For social meta — large square
  ];

  for (const t of targets) {
    const buf = await sharp(master).resize(t.size, t.size).png().toBuffer();
    writeFileSync(t.out, buf);
    console.log(`  ✓ ${path.relative(process.cwd(), t.out)} ${t.size}×${t.size}`);
  }

  // Also generate a 1200×630 OG image (landscape) — wp_logo styled left, walkperro text right
  // For now just use the master tiled — keeping it simple, can iterate later
  const og = await sharp(SRC).resize(1200, 630, { fit: "cover", position: "center" }).png().toBuffer();
  writeFileSync(path.join(PUBLIC, "og.png"), og);
  console.log("  ✓ public/og.png 1200×630");

  console.log("\nDone. Next.js will pick up app/icon.png and app/apple-icon.png automatically.");
}

main().catch((e) => { console.error(e); process.exit(1); });
