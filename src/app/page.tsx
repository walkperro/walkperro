import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import BlogPreview from "@/components/BlogPreview";
import Callout from "@/components/Callout";

const products = [
  {
    slug: "100days",
    title: "$100 Days Tracker",
    tagline: "90-day action system: daily targets, weekly reviews, momentum compounding.",
    price: "$10",
    badge: "Starter",
  },
  {
    slug: "25hacks",
    title: "ChatGPT Cash Hacks (25 Prompts)",
    tagline: "Copy-paste prompts that build products, pages, and profit—fast.",
    price: "$6.99",
    badge: "New",
  },
  {
    slug: "moneymoves",
    title: "Money Moves Toolkit",
    tagline: "Templates + scripts for flipping, services, and faceless content workflows.",
    price: "$19",
  },
  {
    slug: "bundle",
    title: "All-in-One Bundle",
    tagline: "Everything in one pack + future updates. Build the whole system in days.",
    price: "$34.99",
    badge: "-30% Launch",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <p className="text-sm uppercase tracking-widest text-zinc-500">WalkPerro</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Faceless systems that <span className="text-emerald-700">print</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
            Clean templates, AI workflows, and a simple plan to scale $5k–$9k/mo in cashflow.
          </p>
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
            ⚠️ Checkout temporarily disabled while the store is under review. Explore products now—links go live as soon as approval lands.
          </div>
        </section>

        {/* Product grid */}
        <section className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold tracking-tight">Build your stack</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </section>

        <div className="mt-14">
          <BlogPreview />
        </div>

        <Callout />
      </main>
      <Footer />
    </>
  );
}
