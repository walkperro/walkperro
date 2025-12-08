import Link from "next/link";
import Image from "next/image";
import CheckoutButton from "@/components/CheckoutButton";
import { getProductBySlug } from "@/lib/products";

type Params = { slug: string };

export default function ProductPage({ params }: { params: Params }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-2xl font-semibold">Not found</h1>
          <p className="mt-2 text-slate-600">We couldn’t find that product.</p>
          <Link href="/" className="mt-6 inline-block text-emerald-700 hover:underline">Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <nav className="text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{product.name}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            {product.coverImage ? (
              <Image
                src={product.coverImage}
                alt={product.name}
                width={1200}
                height={900}
                className="w-full rounded-xl border border-slate-200 bg-white"
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
                No cover image
              </div>
            )}
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
              {product.eyebrow}
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{product.name}</h1>
            <div className="mt-1 text-slate-500">{product.price}</div>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {product.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>

            {product.footerLine && <p className="mt-3 text-xs text-slate-500">{product.footerLine}</p>}

            <div className="mt-6">
              <CheckoutButton
                priceId={product.stripePriceId}
                label={`Buy Now — ${product.price}`}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
