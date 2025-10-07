// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-5xl font-bold tracking-tight">WalkPerro</h1>
      <p className="mt-4 text-zinc-600">Luxury-minimal tools for relentless builders.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card title="$100 Days" href="/products/100-days" />
        <Card title="Wealth Hacks (FACE)" href="/products/wealth-hacks" />
        <Card title="25 ChatGPT Prompts" href="/products/25-prompts" />
        <Card title="Everything Bundle" href="/bundle" />
      </div>
    </main>
  );
}
function Card({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="block rounded-2xl border border-zinc-200 p-6 hover:shadow-sm transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-zinc-600">View details →</p>
    </Link>
  );
}
