import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content", "log");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  category: string;
  excerpt: string;
};

export type Post = PostMeta & {
  html: string;
};

function toDottedDate(iso: string) {
  // 2026-05-08 → 2026.05.08
  return iso.replaceAll("-", ".");
}

export function formatDate(iso: string) {
  return toDottedDate(iso);
}

async function readPost(file: string): Promise<Post | null> {
  if (!file.endsWith(".md")) return null;
  const slug = file.replace(/\.md$/, "");
  const raw = await readFile(path.join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const html = await marked.parse(content, { gfm: true, breaks: false });
  return {
    slug: (data.slug as string) || slug,
    title: data.title as string,
    date: data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : (data.date as string),
    category: data.category as string,
    excerpt: (data.excerpt as string) || "",
    html,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  let files: string[] = [];
  try {
    files = await readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const posts: Post[] = [];
  for (const file of files) {
    const post = await readPost(file);
    if (post) posts.push(post);
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const all = await getAllPosts();
  return all.map((p) => p.slug);
}
