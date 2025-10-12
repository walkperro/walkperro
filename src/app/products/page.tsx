import Link from "next/link";

const items = [
  { slug: "100-days", title: "$100 Days Tracker", badge: "Starter", price: "$10",
    blurb: "90-day action system: daily targets, weekly reviews, momentum compounding." },
  { slug: "chatgpt-cash-hacks", title: "ChatGPT Cash Hacks (25 Prompts)", badge: "New", price: "$6.99",
    blurb: "Copy–paste prompts that build products, pages, and profit—fast." },
  { slug: "wealth-hacks", title: "Wealth Hacks (F.A.C.E.)", badge: "Popular", price: "$14.99",
    blurb: "Faceless growth systems to scale $5–$9k/mo." },
  { slug: "money-moves-toolkit", title: "Money Moves Toolkit", badge: "Toolkit", price: "$19",
    blurb: "Templates + scripts for flipping, services, and faceless workflows." },
  { slug: "all-in-one-bundle", title: "All-in-One Bundle", badge: "Best value", price: "$29",
    blurb: "All products, one price. Systems that compound momentum." },
];

export default function ProductsIndex() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-4xl font-bold">Products</h1>
      <p className="mt-3 text-zinc-600">Clean templates, AI workflows, and systems that print.</p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((p) => (
          <article key={p.slug} className="rounded-2xl border p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">{p.badge}</span>
            </div>
            <p className="mt-2 text-zinc-700">{p.blurb}</p>
            <div className="mt-5 flex items-center justify-between">
              <div className="text-lg font-semibold">{p.price}</div>
              <Link href={`/products/${p.slug}`} className="rounded-xl border border-black px-5 py-2 hover:bg-black hover:text-white">View</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
