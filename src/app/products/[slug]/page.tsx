import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { getReviewsFor } from "@/lib/reviews";
import CheckoutButton from "@/components/CheckoutButton";
import Stars from "@/components/Stars";

export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) return notFound();

  const reviews = getReviewsFor(product.slug);
  const avg = reviews.length ? Math.round(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length) : 5;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <a href="/" className="text-silver hover:text-bone">← Back</a>

      <h1 className="mt-6 text-3xl md:text-4xl font-semibold">{product.title}</h1>
      <p className="mt-3 text-silver max-w-2xl">{product.blurb}</p>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stars value={avg} />
          <span className="text-silver/70 text-sm">{reviews.length} reviews</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg">$ {product.price.toFixed(2)}</span>
          <CheckoutButton payhipCode={product.payhipCode}>Get it →</CheckoutButton>
        </div>
      </div>

      <section className="mt-12 grid grid-cols-1 gap-4">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-2xl border border-graphite bg-graphite/40 p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.author}</div>
              <Stars value={r.rating} />
            </div>
            <div className="mt-1 text-sm text-bone/90">{r.headline}</div>
            <p className="mt-2 text-silver">{r.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
