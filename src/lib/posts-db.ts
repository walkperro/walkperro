import { admin } from "@/lib/supabase/admin";
import { marked } from "marked";

export type PublishedPostMeta = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  published_at: string;
};

export type PublishedPost = PublishedPostMeta & {
  body_md: string;
  html: string;
};

export function formatDate(iso: string): string {
  // 2026-05-12T13:00:00Z → 2026.05.12
  return iso.slice(0, 10).replaceAll("-", ".");
}

export async function getPublishedPosts(opts: { limit?: number } = {}): Promise<PublishedPostMeta[]> {
  try {
    const { data, error } = await admin()
      .from("posts")
      .select("id, slug, title, category, excerpt, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(opts.limit ?? 50);
    if (error) {
      console.warn("getPublishedPosts:", error.message);
      return [];
    }
    return (data || []) as PublishedPostMeta[];
  } catch (e) {
    console.warn("getPublishedPosts threw:", e);
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPost | null> {
  try {
    const { data } = await admin()
      .from("posts")
      .select("id, slug, title, category, excerpt, published_at, body_md")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!data) return null;
    const html = await marked.parse(data.body_md || "", { gfm: true });
    return { ...(data as any), html } as PublishedPost;
  } catch (e) {
    console.warn("getPublishedPostBySlug threw:", e);
    return null;
  }
}

export async function getPublishedSlugs(): Promise<string[]> {
  try {
    const { data } = await admin()
      .from("posts")
      .select("slug")
      .eq("status", "published");
    return (data || []).map((r: { slug: string }) => r.slug);
  } catch {
    return [];
  }
}

export type NowRow = { building: string | null; reading: string | null; listening: string | null };
export async function getActiveNow(): Promise<NowRow | null> {
  try {
    const { data } = await admin()
      .from("now_strip")
      .select("building, reading, listening")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as NowRow) || null;
  } catch {
    return null;
  }
}

export type PublicTool = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  url: string | null;
  price_cents: number;
};

export type SiteStats = {
  posts: number;
  tools: number;
  drops: number; // posts + non-DRAFT tools — total content "drops"
};

export async function getSiteStats(): Promise<SiteStats> {
  try {
    const supa = admin();
    const [postsCount, toolsCount] = await Promise.all([
      supa.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
      supa.from("tools").select("id", { count: "exact", head: true }).neq("status", "DRAFT"),
    ]);
    const posts = postsCount.count ?? 0;
    const tools = toolsCount.count ?? 0;
    return { posts, tools, drops: posts + tools };
  } catch {
    return { posts: 0, tools: 0, drops: 0 };
  }
}

export async function getPublicTools(): Promise<PublicTool[]> {
  try {
    const { data } = await admin()
      .from("tools")
      .select("id, slug, title, description, status, url, price_cents")
      .neq("status", "DRAFT")
      .order("sort_order", { ascending: true });
    return (data || []) as PublicTool[];
  } catch {
    return [];
  }
}
