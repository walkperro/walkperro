import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/creator/session";

export const metadata: Metadata = { title: "dashboard" };

export default async function AppHome() {
  const session = await getCreatorSession();
  if (!session?.user) redirect("/login?next=/app");

  const name =
    session.creator?.display_name ?? session.user.email ?? "builder";

  return (
    <main className="min-h-screen bg-bone text-charcoal">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="font-mono text-sm tracking-tight">walkperro</span>
        <form action="/auth/signout" method="post">
          <button className="label hover:text-charcoal">// sign out</button>
        </form>
      </header>

      <div className="mx-auto w-full max-w-2xl px-6 py-24">
        <span className="label">// dashboard</span>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.03em]">
          welcome back, {name}.
        </h1>
        <p className="mt-6 max-w-prose text-lg text-smoke">
          paste an account, pick what to sell, publish a storefront. you only pay
          us when something sells.
        </p>
        <a
          href="/app/new"
          className="mt-10 inline-block border border-charcoal bg-charcoal px-6 py-3.5 font-mono text-xs uppercase tracking-[0.08em] text-bone transition-colors duration-150 hover:bg-signal hover:text-charcoal"
        >
          make a new product
        </a>
      </div>
    </main>
  );
}
