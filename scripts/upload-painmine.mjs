// One-shot: upload painmine-bundle to Supabase Storage `tools` bucket and
// update walkperro.tools.file_path so /tools/painmine becomes downloadable.
//
// Idempotent — safe to re-run after a new bundle version drops; just bump the
// SOURCE constant. Existing rows in tool_downloads continue to work because
// the download endpoint looks up the current tool.file_path at request time.

import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { supabase } from "./_supabase.mjs";

const SOURCE = process.argv[2] || "/Users/ironclaw/projects/painmine/painmine-bundle-0.3.1.zip";
const BUCKET = "tools";
const SLUG = "painmine";
const STORAGE_PATH = `${SLUG}/${path.basename(SOURCE)}`;

async function main() {
  // 1. Confirm source file exists
  const st = statSync(SOURCE);
  console.log(`Source: ${SOURCE}`);
  console.log(`  size: ${(st.size / 1024).toFixed(1)} KB`);

  // 2. Ensure the bucket exists (private)
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) { console.error("listBuckets:", listErr.message); process.exit(1); }
  const has = buckets.some((b) => b.name === BUCKET);
  if (!has) {
    console.log(`Creating bucket: ${BUCKET} (private)`);
    const { error: cErr } = await supabase.storage.createBucket(BUCKET, {
      public: false,
      // fileSizeLimit omitted — Free tier caps individual uploads at ~50MB.
      // Painmine bundle is <100KB so we don't need anything custom.
    });
    if (cErr) { console.error("createBucket:", cErr.message); process.exit(1); }
  } else {
    console.log(`Bucket exists: ${BUCKET}`);
  }

  // 3. Upload (upsert so re-runs overwrite the same path)
  const buf = readFileSync(SOURCE);
  console.log(`Uploading → ${BUCKET}/${STORAGE_PATH}`);
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(STORAGE_PATH, buf, {
      contentType: "application/zip",
      upsert: true,
    });
  if (upErr) { console.error("upload:", upErr.message); process.exit(1); }
  console.log("  ✓ uploaded");

  // 4. Update the tools row
  const { error: tErr } = await supabase
    .from("tools")
    .update({ file_path: STORAGE_PATH })
    .eq("slug", SLUG);
  if (tErr) { console.error("tool update:", tErr.message); process.exit(1); }
  console.log(`  ✓ walkperro.tools.file_path updated for slug=${SLUG}`);

  // 5. Quick verify — read back
  const { data: tool } = await supabase
    .from("tools")
    .select("slug, title, status, requires_email, price_cents, file_path")
    .eq("slug", SLUG)
    .single();
  console.log("\nFinal tool row:");
  console.log(JSON.stringify(tool, null, 2));
}

main().catch((e) => { console.error("Failed:", e); process.exit(1); });
