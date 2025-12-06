import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">← Back home</Link>
          <span className="text-xs uppercase tracking-widest text-slate-400">Blog</span>
        </header>

        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Notes from the build</h1>
        <p className="mb-8 text-slate-600">Quick hits on systems, cashflow, aesthetics, and product plays.</p>

        {/* Replace with real posts later */}
        <ul className="space-y-4">
          <li className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm">
            <a className="block" href="#">
              <p className="text-sm text-emerald-600">Playbook</p>
              <h3 className="text-lg font-semibold">The 90-day momentum stack</h3>
              <p className="text-sm text-slate-600">The small set of moves that compounds quietly.</p>
            </a>
          </li>
          <li className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm">
            <a className="block" href="#">
              <p className="text-sm text-emerald-600">Design</p>
              <h3 className="text-lg font-semibold">Luxury minimalism, without the fluff</h3>
              <p className="text-sm text-slate-600">Aesthetic first. Complexity is a tax.</p>
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
