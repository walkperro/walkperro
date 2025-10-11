import Link from "next/link";

export default function BlogPreview() {
  const posts = [
    { slug: "face-framework", title: "F.A.C.E. in the wild: 7 pages that print", date: "2025-10-01" },
    { slug: "ai-hooks", title: "20 faceless hooks that convert today", date: "2025-10-05" },
    { slug: "offer-up-flips", title: "From $0 to $500: local flips in a weekend", date: "2025-10-07" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight">From the Journal</h2>
        <Link href="/blog" className="text-sm text-emerald-700 hover:underline">See all</Link>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-2xl border border-zinc-100 p-5 hover:shadow-sm">
            <p className="text-xs text-zinc-500">{new Date(p.date).toLocaleDateString()}</p>
            <h3 className="mt-2 font-semibold">{p.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
