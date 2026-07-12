import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Filesystem-backed guides — content/guides/*.md through the same
// gray-matter/marked pipeline as the blog's migration script. Guides are
// curated sales/education collateral and belong in git, NOT the posts DB
// (plan section E).

export type GuideMeta = {
  slug: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  order: number;
};

export type Guide = GuideMeta & { html: string };

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

function parseFile(filename: string): Guide {
  const raw = readFileSync(path.join(GUIDES_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).length;
  return {
    slug: data.slug || filename.replace(/\.md$/, ""),
    title: data.title || filename,
    excerpt: data.excerpt || "",
    readMinutes: Math.max(1, Math.round(words / 220)),
    order: data.order ?? 99,
    html: marked.parse(content, { gfm: true, async: false }) as string,
  };
}

export function getAllGuides(): GuideMeta[] {
  try {
    return readdirSync(GUIDES_DIR)
      .filter((f) => f.endsWith(".md"))
      .map(parseFile)
      .sort((a, b) => a.order - b.order)
      .map(({ html: _html, ...meta }) => meta);
  } catch {
    return [];
  }
}

export function getGuideBySlug(slug: string): Guide | null {
  try {
    const file = readdirSync(GUIDES_DIR).find(
      (f) => f.endsWith(".md") && parseFile(f).slug === slug
    );
    return file ? parseFile(file) : null;
  } catch {
    return null;
  }
}
