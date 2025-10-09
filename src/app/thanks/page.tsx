import Link from 'next/link';
import GiscusReviews from '@/components/GiscusReviews';

export const metadata = {
  title: 'Thanks — Your access is ready | WalkPerro',
  description: 'Download your product, grab your bundle coupon, and leave a quick review.',
};

export default function Page() {
  // Optional: you can detect which product they bought via query params later.
  const productName = '$100 Days Challenge';

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="rounded-2xl border border-zinc-200 p-8">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white">✓</div>
          <div>
            <h1 className="text-3xl font-bold">You’re in. Access unlocked.</h1>
            <p className="mt-1 text-zinc-600">
              Payment confirmed. A receipt and link were also emailed to you.
            </p>
          </div>
        </div>

        {/* Download + actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* If you host the PDF in /public, link to /downloads/...; otherwise use your Lemon Squeezy file link */}
          <Link
            href="/downloads/100-days-tracker.pdf"
            className="rounded-xl bg-black px-5 py-3 text-center font-medium text-white hover:opacity-90"
          >
            Download {productName}
          </Link>

          {/* Optional: link to your Google Doc copy version */}
          <a
            href="https://docs.google.com/…(your share link)…"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-zinc-300 px-5 py-3 text-center font-medium hover:bg-zinc-50"
          >
            Open the Google Sheet tracker
          </a>
        </div>

        {/* Mini checklist */}
        <ul className="mt-6 list-disc space-y-1 pl-6 text-zinc-700">
          <li>Bookmark this page for quick access.</li>
          <li>Start today—momentum compounds fast.</li>
          <li>Come back and leave a review with your first win.</li>
        </ul>

        {/* Bundle upsell */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 p-[1px]">
          <div className="rounded-xl bg-white p-6">
            <h2 className="text-xl font-semibold">Unlock the Full Bundle — Save 30%</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Get the All-In-One Toolkit (Wealth Hacks, $100 Days, 25 Prompts, Money Moves) with{" "}
              <span className="font-medium text-emerald-700">code: WALK30</span>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://YOURSTORE.lemonsqueezy.com/checkout/buy/BUNDLE_ID?discount=WALK30"
                data-ls-modal="true"
                className="rounded-xl bg-black px-5 py-3 text-white"
              >
                Apply Code & View Bundle
              </a>
              <Link
                href="/bundle"
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                See what’s inside
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <GiscusReviews term="100 Days Challenge" />
      </div>
    </main>
  );
}
