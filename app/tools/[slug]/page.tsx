import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicTool } from "@/lib/tools-server";
import ToolCta from "./ToolCta";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getPublicTool(slug).catch(() => null);
  if (!tool) return { title: "walkperro / tool" };
  return {
    title: `${tool.title} — walkperro`,
    description: tool.description,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getPublicTool(slug);
  if (!tool) notFound();

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <Link href="/" className="label hover:text-charcoal">← BACK</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <section className="pt-20 pb-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <p className="label">{`// TOOL — ${tool.slug.toUpperCase()}`}</p>
            <div className="hairline mt-3 mb-8" />
            <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] max-w-2xl">
              {tool.title}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-charcoal/80">
              {tool.description}
            </p>
            <div className="mt-10 max-w-lg">
              <ToolCta
                slug={tool.slug}
                priceCents={tool.price_cents}
                requiresEmail={tool.requires_email}
                hasFile={!!tool.file_path}
                stripePriceId={tool.stripe_price_id}
              />
            </div>
          </div>
          <aside className="md:col-span-4 md:pl-8 md:border-l md:border-line flex flex-col gap-2 self-start">
            <p className="label">// META</p>
            <p className="label mt-2">STATUS / {tool.status}</p>
            {tool.price_cents > 0 ? (
              <p className="label">PRICE / ${(tool.price_cents / 100).toFixed(2)}</p>
            ) : (
              <p className="label">PRICE / FREE</p>
            )}
            <p className="label">EMAIL / {tool.requires_email ? "REQUIRED" : "OPTIONAL"}</p>
            {tool.download_count > 0 && (
              <p className="label">DOWNLOADS / {tool.download_count}</p>
            )}
          </aside>
        </section>

        <footer className="hairline mt-12 mb-12 pt-8 flex flex-col gap-2">
          <p className="label">— walkperro / for the ones who do</p>
          <p className="label">© 2026 / FACELESS / ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </main>
  );
}
