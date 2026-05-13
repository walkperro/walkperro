import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug, getPublishedSlugs, formatDate } from "@/lib/posts-db";

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Not found — walkperro" };
  return {
    title: `${post.title} — walkperro`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <Link href="/log" className="label hover:text-charcoal">← ALL ENTRIES</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <article className="pt-20 pb-20">
          <div className="flex items-baseline justify-between gap-6">
            <p className="label">
              {`// ${formatDate(post.published_at)}`}
              <span className="ml-3">{post.category}</span>
            </p>
            <p className="label">// LOG</p>
          </div>
          <div className="hairline mt-3" />

          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] mt-8 max-w-3xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-charcoal/70">
              {post.excerpt}
            </p>
          )}

          <div className="hairline mt-12 mb-12" />

          <div
            className="prose-field"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <div className="hairline mt-16 pt-6 max-w-prose">
            <p className="font-mono text-[0.75rem] tracking-label text-smoke lowercase">— walkperro</p>
          </div>
        </article>

        <footer className="hairline mb-12 pt-8 flex flex-col gap-2">
          <p className="label">— walkperro / for the ones who do</p>
          <p className="label">© 2026 / FACELESS / ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </main>
  );
}
