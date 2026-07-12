import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuideBySlug(slug);
  if (!g) return { title: "not found" };
  return {
    title: `${g.title} — guides`,
    description: g.excerpt,
    alternates: { canonical: `https://www.walkperro.com/guides/${g.slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuideBySlug(slug);
  if (!g) return notFound();

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/70">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <Link href="/guides" className="label hover:text-charcoal">← ALL GUIDES</Link>
        </div>
      </header>

      <article className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="pt-16 pb-8">
          <p className="label">// GUIDE — {g.readMinutes} MIN READ</p>
          <div className="hairline mt-3" />
          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] mt-8 max-w-3xl">
            {g.title}
          </h1>
        </div>

        <div
          className="prose-field pb-16"
          dangerouslySetInnerHTML={{ __html: g.html }}
        />

        <div className="hairline pt-6 pb-16 flex flex-wrap gap-3">
          <Button href="/#showroom" variant="ghost">
            SEE THE SHOWROOM →
          </Button>
          <Button href="/websites">GET A SITE BUILT →</Button>
        </div>
      </article>
    </main>
  );
}
