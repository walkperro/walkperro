import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { products } from "@/lib/products";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <main className="noise-bg min-h-dvh flex items-center justify-center px-4">
        <div className="max-w-md text-center text-sm text-bone/70">
          <p className="mb-4">This piece is not in the Exhibit.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-emerald px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald hover:bg-emerald hover:text-ink transition-colors"
          >
            Back to Exhibit
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="noise-bg min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between pb-6">
          <Link
            href="/"
            className="text-[0.7rem] text-bone/60 hover:text-bone transition-colors"
          >
            ← Back to Exhibit
          </Link>
          <span className="text-[0.7rem] uppercase tracking-[0.28em] text-bone/50">
            WalkPerro • Detail
          </span>
        </header>

        <article className="space-y-6 rounded-3xl border border-bone/15 bg-ink/70 px-5 py-6 backdrop-blur">
          <div className="space-y-2">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bone/60">
              {product.tag}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl text-bone">
              {product.title}
            </h1>
          </div>

          <p className="text-sm text-bone/75">{product.blurb}</p>

          <ul className="space-y-2 text-[0.8rem] text-bone/70">
            {product.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-[0.3rem] h-[3px] w-[3px] rounded-full bg-emerald/80" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-bone">
                ${product.price.toFixed(2)}
              </span>
              {product.featured && (
                <span className="rounded-full bg-emerald/15 px-2 py-[1px] text-[0.65rem] uppercase tracking-[0.16em] text-emerald">
                  Best value
                </span>
              )}
            </div>

            <CheckoutButton
              payhipCode={product.payhipCode}
              slug={product.slug}
              title={product.title}
              price={product.price}
            >
              Get it →
            </CheckoutButton>
          </div>

          <p className="text-[0.7rem] text-bone/50">
            Secure checkout via Payhip. Files delivered instantly to your email.
          </p>
        </article>

        <footer className="mt-10 border-t border-bone/10 pt-4 text-[0.7rem] text-bone/45">
          <span>WalkPerro • Built for the relentless.</span>
        </footer>
      </div>
    </main>
  );
}
