#!/usr/bin/env node
// Motion reels v1 — ken-burns drift over each showroom still → 10s looping
// webm at 1280x800, target <1.5MB each. Output: public/showroom/reels/<slug>.webm
// v2 replaces these with real screen-recording reels through the Remotion
// pipeline (1k2rich-remotion) — same file paths, so the site doesn't change.
//
// Requires ffmpeg (brew). Re-run after textures change.

import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";

const TEX_DIR = path.join("public", "showroom", "tex");
const OUT_DIR = path.join("public", "showroom", "reels");
mkdirSync(OUT_DIR, { recursive: true });

const FPS = 24;
const DUR = 10; // seconds
const FRAMES = FPS * DUR;

// Alternate drift directions per item so the corridor doesn't feel looped.
const MOVES = [
  // slow zoom-in, drift right
  `zoompan=z='min(zoom+0.0006,1.18)':x='iw/2-(iw/zoom/2)+on*0.35':y='ih/2-(ih/zoom/2)':d=${FRAMES}:s=1280x800:fps=${FPS}`,
  // slow zoom-in, drift down
  `zoompan=z='min(zoom+0.0006,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+on*0.22':d=${FRAMES}:s=1280x800:fps=${FPS}`,
  // start zoomed, pull back
  `zoompan=z='max(1.18-on*0.0007,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FRAMES}:s=1280x800:fps=${FPS}`,
];

const textures = readdirSync(TEX_DIR).filter((f) => f.endsWith(".webp"));
let ok = 0;
textures.forEach((file, i) => {
  const slug = file.replace(/\.webp$/, "");
  const out = path.join(OUT_DIR, `${slug}.webm`);
  const move = MOVES[i % MOVES.length];
  try {
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-loop", "1",
        "-i", path.join(TEX_DIR, file),
        "-vf", `scale=2560:1600,${move}`,
        "-t", String(DUR),
        "-c:v", "libvpx-vp9",
        "-b:v", "0",
        "-crf", "40",
        "-an",
        "-row-mt", "1",
        out,
      ],
      { stdio: "pipe" }
    );
    const kb = (statSync(out).size / 1024).toFixed(0);
    console.log(`✓ ${out} (${kb}kb)`);
    ok++;
  } catch (e) {
    console.error(`✗ ${slug}: ${String(e.message).slice(0, 200)}`);
  }
});
console.log(`\nDone. ${ok}/${textures.length} reels.`);
if (ok < textures.length) process.exit(1);
