import HeroExhibit from "@/components/HeroExhibit";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main className="noise max-w-6xl mx-auto px-6 py-10 md:py-16">
      {/* Topbar */}
      <nav className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-emerald/20 border border-emerald/30" />
          <span className="tracking-[0.2em] uppercase text-silver text-xs">WALK•PERRO</span>
        </div>
        <a href="#exhibit" className="text-silver hover:text-bone text-sm">Exhibit ↓</a>
      </nav>

      <HeroExhibit />

      <section id="exhibit" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            title={p.title}
            blurb={p.blurb}
            price={p.price}
            payhipCode={p.payhipCode}
          />
        ))}
      </section>

      <footer className="mt-16 text-center text-silver/70 text-sm">
        Built for the relentless. © WalkPerro
      </footer>
    </main>
  );
}
