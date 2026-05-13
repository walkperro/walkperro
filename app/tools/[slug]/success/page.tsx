import Link from "next/link";
import { getPublicTool } from "@/lib/tools-server";

export const dynamic = "force-dynamic";

export default async function ToolSuccessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getPublicTool(slug);

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">walkperro</Link>
          <Link href="/" className="label hover:text-charcoal">← BACK</Link>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-6 py-24">
        <p className="label">// PURCHASE — COMPLETE</p>
        <div className="hairline mt-3 mb-8" />
        <h1 className="font-display text-5xl leading-tight tracking-[-0.03em] mb-6">
          you&apos;re in.
        </h1>
        <p className="text-lg text-charcoal/80 max-w-prose mb-8">
          Your download link for{" "}
          <strong>{tool?.title || "the tool"}</strong>{" "}
          is on its way to your inbox right now. Click it and you&apos;re in.
        </p>
        <p className="label text-smoke">// IF YOU DON&apos;T SEE IT IN 5 MINUTES, CHECK SPAM.</p>
      </div>
    </main>
  );
}
