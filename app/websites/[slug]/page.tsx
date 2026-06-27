import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import WebsiteInquiryForm from "@/components/WebsiteInquiryForm";
import {
  getAllWebsites,
  getWebsiteBySlug,
  getWebsiteSlugs,
} from "@/lib/websites";

// /websites/<slug> — preview + inquiry form. ISR with revalidate=60. Static
// params seeded from getWebsiteSlugs() so each of the 10 templates ships
// prerendered.

export const revalidate = 60;

const CATEGORY_LABEL: Record<string, string> = {
  service: "service site",
  ecommerce: "e-commerce",
  "web-app": "web app",
};

export async function generateStaticParams() {
  return getWebsiteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = getWebsiteBySlug(slug);
  if (!w) return { title: "not found" };
  return {
    title: `${w.title} — websites`,
    description: w.blurb,
    alternates: {
      canonical: `https://www.walkperro.com/websites/${w.slug}`,
    },
    openGraph: {
      title: `${w.title} — walkperro websites`,
      description: w.blurb,
      url: `https://www.walkperro.com/websites/${w.slug}`,
      images: [{ url: w.thumb, width: 1600, height: 1000, alt: w.title }],
    },
  };
}

export default async function WebsiteDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = getWebsiteBySlug(slug);
  if (!w) return notFound();

  const others = getAllWebsites()
    .filter((s) => s.slug !== w.slug)
    .slice(0, 3);

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      {/* Sticky hairline nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/70">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <Link href="/websites" className="label hover:text-charcoal">← ALL TYPES</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">

        {/* Header */}
        <section data-reveal className="pt-16 pb-10">
          <p className="label">
            // {CATEGORY_LABEL[w.category]}
            {w.liveUrl ? <span className="ml-3">// LIVE EXAMPLE</span> : null}
          </p>
          <div className="hairline mt-3" />
          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] mt-8 max-w-3xl">
            {w.title}.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/80">
            {w.blurb}
          </p>
          <p className="mt-4 label text-smoke">
            {w.tags.map((t) => `// ${t}`).join(" ")}
          </p>
        </section>

        {/* Preview + form */}
        <section
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20"
        >
          <div className="lg:col-span-7">
            <div className="border border-charcoal bg-line aspect-[16/10] overflow-hidden">
              <img
                src={w.thumb}
                alt={`${w.title} template preview`}
                className="h-full w-full object-cover"
              />
            </div>
            {w.liveUrl && (
              <div className="mt-6">
                <Button href={w.liveUrl} external variant="ghost">
                  VIEW THE LIVE SITE →
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <WebsiteInquiryForm
              templateSlug={w.slug}
              templateTitle={w.title}
            />
          </div>
        </section>

        {/* Other types */}
        <section data-reveal className="py-16 border-t border-line">
          <SectionHeader label="OR PICK ANOTHER" meta="// 03 SHOWN" />
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line">
            {others.map((s) => (
              <li key={s.slug} className="bg-bone">
                <Link href={`/websites/${s.slug}`} className="group block h-full">
                  <div className="relative aspect-[16/10] overflow-hidden bg-line">
                    <img
                      src={s.thumb}
                      alt={`${s.title} website example`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-snap ease-snap group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="px-5 py-4 flex items-baseline justify-between gap-3 border-t border-line">
                    <p className="font-display text-xl">{s.title}</p>
                    <span className="label group-hover:text-charcoal">→</span>
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
