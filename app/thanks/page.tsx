import { redirect } from "next/navigation";
import Link from "next/link";

type SP = Record<string, string | string[] | undefined>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ThanksPage({ searchParams }: { searchParams: SP }) {
  const v = (k: string) => {
    const x = searchParams?.[k];
    return typeof x === "string" ? x : Array.isArray(x) ? x[0] : undefined;
  };

  // Support all common Stripe return param names
  const sid =
    v("session_id") ||
    v("checkout_session_id") ||
    v("sid") ||
    v("session");

  if (sid) redirect(`/thanks/${sid}`);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-slate-200 text-lg">
            Missing session. If you just paid, check your email for your receipt & downloads.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
