import Link from "next/link";
import { getPublishedPosts, formatDate } from "@/lib/posts-db";

export const revalidate = 60;

export const metadata = {
  title: "build log — walkperro",
  description:
    "Field notes, build logs, and tools. Long-form, first-person, one opinion per post.",
};

export default async function LogIndex() {
  const posts = await getPublishedPosts({ limit: 50 });

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <Link href="/" className="label hover:text-charcoal">← BACK</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <section className="pt-20 pb-10">
          <div className="flex items-baseline justify-between gap-6">
            <p className="label">// BUILD LOG — FIELD NOTES</p>
            <p className="label">
              {posts.length} {posts.length === 1 ? "ENTRY" : "ENTRIES"}
            </p>
          </div>
          <div className="hairline mt-3" />
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] mt-6 max-w-3xl">
            Notes from someone building with AI.
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-charcoal/80">
            Long-form. First person. One opinion per post, defended. Written for
            the people who would rather read a page than skim a thread.
          </p>
        </section>

        <section className="pb-24">
          {posts.length === 0 ? (
            <p className="label text-smoke">// CHECK BACK TUESDAY.</p>
          ) : (
            <ul className="border-t border-line">
              {posts.map((p) => (
                <li key={p.id} className="border-b border-line">
                  <Link
                    href={`/log/${p.slug}`}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-8 transition-colors duration-snap ease-snap hover:bg-line/40"
                  >
                    <div className="md:col-span-3 label">
                      {`// ${formatDate(p.published_at)}`}
                      <span className="ml-3">{p.category}</span>
                    </div>
                    <div className="md:col-span-8">
                      <h2 className="font-display text-3xl leading-tight tracking-[-0.015em]">
                        {p.title}
                      </h2>
                      {p.excerpt && (
                        <p className="mt-3 max-w-prose text-charcoal/80 text-lg leading-relaxed">
                          {p.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-1 md:text-right label group-hover:text-charcoal">
                      READ →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="hairline mb-12 pt-8 flex flex-col gap-2">
          <p className="label">— walkperro / for the ones who do</p>
          <p className="label">© 2026 walkperro / ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </main>
  );
}
