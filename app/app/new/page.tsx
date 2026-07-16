import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireCreator } from "@/lib/creator/session";
import OnboardFlow from "@/components/app/OnboardFlow";

export const metadata: Metadata = { title: "new product" };

export default async function NewProductPage() {
  const ok = await requireCreator()
    .then(() => true)
    .catch(() => false);
  if (!ok) redirect("/login?next=/app/new");

  return (
    <main className="min-h-screen bg-bone text-charcoal">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <a href="/app" className="font-mono text-sm tracking-tight">
          walkperro
        </a>
        <a href="/app" className="label hover:text-charcoal">
          // dashboard
        </a>
      </header>
      <OnboardFlow />
    </main>
  );
}
