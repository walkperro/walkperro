// Idempotent: walks content/log/*.md, upserts into walkperro.posts by slug.
// Sets explicit scheduled_for for the two existing posts (Tue + Fri 9am ET, DST).
// Preserves frontmatter + raw markdown body byte-for-byte (body_md is the full body after frontmatter).

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { supabase } from "./_supabase.mjs";

const CONTENT_DIR = path.join(process.cwd(), "content", "log");

// Schedule overrides for the two seed posts.
const SCHEDULE = {
  "what-a-time-to-be-alive": "2026-05-12T09:00:00-04:00", // Tue 9am ET (EDT, -04:00)
  "no-pain-no-profit":       "2026-05-15T09:00:00-04:00", // Fri 9am ET (EDT, -04:00)
};

async function main() {
  let files;
  try {
    files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md"));
  } catch (e) {
    console.error(`No content directory at ${CONTENT_DIR}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("No markdown files to migrate.");
    return;
  }

  let upserted = 0;
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = await readFile(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const title = data.title;
    const dataSlug = data.slug || slug;
    const category = data.category || "BUILD LOG";
    const excerpt = data.excerpt || null;
    const scheduledFor = SCHEDULE[dataSlug] || null;

    if (!title) {
      console.warn(`Skipping ${file} — missing title in frontmatter`);
      continue;
    }

    const row = {
      slug: dataSlug,
      title,
      category,
      excerpt,
      body_md: content,
      status: scheduledFor ? "scheduled" : "draft",
      scheduled_for: scheduledFor,
    };

    const { error } = await supabase
      .from("posts")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      console.error(`Upsert error for ${dataSlug}:`, error.message);
      continue;
    }
    upserted++;
    console.log(`  ✓ ${dataSlug}  status=${row.status}  scheduled_for=${scheduledFor || "(none)"}`);
  }

  console.log(`\nDone. Upserted ${upserted} posts.`);
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
