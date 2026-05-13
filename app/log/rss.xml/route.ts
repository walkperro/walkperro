import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/posts-db";

const SITE = "https://www.walkperro.com";

export const revalidate = 60;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts({ limit: 50 });

  const items = posts
    .map((p) => {
      const url = `${SITE}/log/${p.slug}`;
      const date = p.published_at ? new Date(p.published_at).toUTCString() : "";
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description>${escapeXml(p.excerpt || "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>walkperro / log</title>
    <link>${SITE}/log</link>
    <atom:link href="${SITE}/log/rss.xml" rel="self" type="application/rss+xml" />
    <description>Tools, opinions, and field notes from someone building with AI from the ground up.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
