import Link from "next/link";

const POSTS = [
  {
    slug: "pricing-mistake",
    date: "2026.05.04",
    label: "BUILD LOG",
    title: "The pricing mistake that almost killed my freelance year.",
    dek: "I priced for the project. I should have priced for the room.",
  },
  {
    slug: "shape-of-one-person",
    date: "2026.04.22",
    label: "FIELD NOTE",
    title: "Cursor, Claude, and the new shape of a one-person team.",
    dek: "What used to need three people now needs one operator and a spec.",
  },
  {
    slug: "twelve-line-cms",
    date: "2026.04.10",
    label: "TOOL",
    title: "The 12-line script that replaced my CMS.",
    dek: "MDX, gray-matter, a glob. That's it. That's the post.",
  },
];

export default function BlogIndex() {
  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label">
            walkperro
          </Link>
          <Link href="/" className="label">← BACK</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* Section header */}
        <section className="pt-20 pb-10">
          <div className="flex items-baseline justify-between gap-6">
            <p className="label">// BUILD LOG — FIELD NOTES</p>
            <p className="label">{POSTS.length} ENTRIES</p>
          </div>
          <div className="hairline mt-3" />
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] tracking-[-0.03em] mt-6 max-w-3xl">
            Notes from one operator, in real time.
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-charcoal/80">
            Long-form. First person. One opinion per post, defended. Written for
            the people who would rather read a page than skim a thread.
          </p>
        </section>

        {/* Post list */}
        <section className="pb-24">
          <ul className="border-t border-line">
            {POSTS.map((p) => (
              <li key={p.slug} className="border-b border-line">
                <article className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8">
                  <div className="md:col-span-3 label">
                    {`// ${p.date}`}
                    <span className="ml-3">{p.label}</span>
                  </div>
                  <div className="md:col-span-9">
                    <h2 className="font-display text-3xl leading-tight tracking-[-0.015em]">
                      {p.title}
                    </h2>
                    <p className="mt-3 max-w-prose text-charcoal/80 text-lg leading-relaxed">
                      {p.dek}
                    </p>
                    <p className="mt-4 label text-charcoal/60">SOON →</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <footer className="hairline mb-12 pt-8 flex flex-wrap items-baseline justify-between gap-3">
          <p className="label">— walkperro</p>
          <Link href="/" className="label hover:text-charcoal">RETURN HOME →</Link>
        </footer>
      </div>
    </main>
  );
}
