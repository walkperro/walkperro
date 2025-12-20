import Link from "next/link";
import ThanksClient from "./ThanksClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MaybePromise<T> = T | Promise<T>;

export default async function ThanksSidPage({
  params,
}: {
  params: MaybePromise<{ sid?: string }>;
}) {
  const p = (await params) as { sid?: string };
  const sid = p?.sid;

  // Guard: never render client component with undefined sid
  // NOTE: Next 16 may provide params as a Promise; awaiting above hardens this.
  if (!sid || sid === "undefined" || !sid.startsWith("cs_")) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="text-3xl font-semibold tracking-tight">You’re in. ✅</h1>
          <div className="mt-7 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
            Missing or invalid session id. Please use the links in your email receipt.
          </div>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-white px-5 py-2 text-slate-900 font-semibold"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return <ThanksClient sid={sid} />;
}
