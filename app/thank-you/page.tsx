import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="noise-bg min-h-dvh flex items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-bone/15 bg-ink/70 px-6 py-8 text-center text-sm text-bone/80">
        <h1 className="font-display text-2xl mb-3 text-bone">You&apos;re in.</h1>
        <p className="mb-4">
          Your WalkPerro files have been sent to your email and are ready to
          download instantly.
        </p>
        <p className="text-bone/60 mb-6">
          If you don&apos;t see them in a few minutes, check spam / promotions.
          Still nothing? Reply to your receipt and we&apos;ll sort it.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-emerald px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald hover:bg-emerald hover:text-ink transition-colors"
        >
          Back to Exhibit
        </Link>
      </div>
    </main>
  );
}
