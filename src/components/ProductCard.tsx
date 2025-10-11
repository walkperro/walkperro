import Link from "next/link";

type Product = {
  slug: string;
  title: string;
  tagline: string;
  price: string;
  badge?: string;
};

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
        {p.badge && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {p.badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-zinc-600">{p.tagline}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-base font-semibold">{p.price}</span>
        <Link
          href={`/products/${p.slug}`}
          className="rounded-xl border border-zinc-900 px-4 py-2 text-sm hover:bg-zinc-900 hover:text-white"
        >
          View
        </Link>
      </div>
    </div>
  );
}
