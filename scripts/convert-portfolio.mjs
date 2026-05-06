import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/portfolio/originals");
const OUT = path.resolve("public/portfolio");

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f));

for (const file of files) {
  const base = file.replace(/\.(png|jpe?g)$/i, "");
  const inPath = path.join(SRC, file);
  const outPath = path.join(OUT, `${base}.webp`);
  await sharp(inPath)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath);
  console.log(`→ ${base}.webp`);
}

console.log(`\nDone. ${files.length} images converted.`);
