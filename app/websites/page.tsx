import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { getAllWebsites } from "@/lib/websites";

// /websites — catalog grid. 10 templates Walk can build for clients. Click any
// thumbnail to land on /websites/<slug>, which carries the inquiry form.
// Plan: /Users/ironclaw/.claude/plans/walkperro-admin-declarative-giraffe.md

export const revalidate = 60;

export const metadata = {
  title: "websites i build",
  description:
    "a catalog of website types walkperro builds for clients — restaurants, ecommerce, lead-gen, web apps. pick the one closest to what you want, tell me about your business, get a quote.",
  alternates: { canonical: "https://www.walkperro.com/websites" },
  openGraph: {
    title: "websites — walkperro",
    description:
      "10 website types i can ship in a week. pick the one closest to what you want.",
    url: "https://www.walkperro.com/websites",
  },
};

const CATEGORY_LABEL: Record<string, string> = {
  service: "service site",
  ecommerce: "e-commerce",
  "web-app": "web app",
};

export default function WebsitesCatalog() {
  const sites = getAllWebsites();

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      {/* Sticky hairline nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/70">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <Link href="/" className="label hover:text-charcoal">← BACK</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">

        {/* Hero band */}
        <section data-reveal className="pt-20 pb-12">
          <p className="label">// websites — pick the one closest to what you want</p>
          <div className="hairline mt-3" />
          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] mt-8 max-w-3xl">
            i build this. click the one you want.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/80">
            ten website types i ship for clients — restaurants, lead-gen sites,
            ecommerce, web apps. tap the thumbnail closest to what you want.
            you'll get a quick form. i read every one. i reply to most within
            24 hours.
          </p>
          <p className="mt-6 label text-smoke">
            // built in next.js. fast. mobile-first. brand-locked.
          </p>
        </section>

        {/* Catalog grid */}
        <section
          data-reveal
          className="pb-24"
        >
          <SectionHeader
            label="CATALOG"
            meta={`${sites.length} ${sites.length === 1 ? "TYPE" : "TYPES"}`}
          />

          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {sites.map((s, i) => (
              <li key={s.slug} className="bg-bone">
                <Link
                  href={`/websites/${s.slug}`}
                  className="group block h-full"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-line">
                    <img
                      src={s.thumb}
                      alt={`${s.title} website example`}
                      loading={i < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-snap ease-snap group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-3 left-3 font-mono uppercase tracking-label text-[0.7rem] bg-bone/95 text-charcoal px-2 py-1 border border-charcoal">
                      {CATEGORY_LABEL[s.category]}
                    </div>
                  </div>
                  <div className="px-5 py-5 flex flex-col gap-2 border-t border-line">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-display text-2xl leading-tight">
                        {s.title}
                      </p>
                      <span className="font-mono uppercase tracking-label text-[0.7rem] shrink-0 transition-transform duration-snap ease-snap group-hover:translate-x-1">
                        I WANT THIS →
                      </span>
                    </div>
                    <p className="text-charcoal/80 leading-snug">{s.blurb}</p>
                    <p className="label text-smoke mt-1">
                      {s.tags.map((t) => `// ${t}`).join(" ")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="hairline mt-12 mb-12 pt-8 flex flex-col gap-2">
          <p className="label">— walkperro / for the ones who do</p>
          <p className="label">© 2026 walkperro / ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </main>
  );
}
