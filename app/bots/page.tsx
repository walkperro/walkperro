import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import InquiryForm from "@/components/InquiryForm";

// /bots — the trading-bot creation service. Shows 1k2rich as the public
// receipt, explains the spy_paper_bot class of work, ends in an inquiry.
// Plan section F.

export const revalidate = 60;

export const metadata = {
  title: "trading bots",
  description:
    "i build trading bots to spec — strategy coded, backtested, deployed to a broker, journaled in public. 1k2rich is the receipt: a $1k bankroll traded by a bot, every position public.",
  alternates: { canonical: "https://www.walkperro.com/bots" },
  openGraph: {
    title: "trading bots — walkperro",
    description:
      "strategy → backtest → live runner. watch one trade in public at 1k2rich.",
    url: "https://www.walkperro.com/bots",
  },
};

const PROCESS: { step: string; body: string }[] = [
  {
    step: "the edge",
    body: "you bring the idea — a setup you trade by hand, a signal you trust. we define it precisely enough that a machine can't misread it.",
  },
  {
    step: "the code",
    body: "python against your broker's api. entries, exits, sizing, kill-switches. every decision logged so you can audit the bot like an employee.",
  },
  {
    step: "the backtest",
    body: "the strategy runs against years of data before it touches a dollar. you see the drawdowns before they see you.",
  },
  {
    step: "paper first",
    body: "it trades fake money in real markets until the logs prove it does what the backtest promised. only then does it go live — at a size you set.",
  },
];

export default function BotsPage() {
  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/70">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <Link href="/" className="label hover:text-charcoal">← BACK</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">

        {/* Hero */}
        <section data-reveal className="pt-20 pb-12">
          <p className="label">// trading bots — built to spec</p>
          <div className="hairline mt-3" />
          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] mt-8 max-w-3xl">
            i also build robots that trade.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/80">
            not signals. not a course. a machine that runs your strategy while
            you sleep — coded, backtested, paper-traded, then live at a size
            you control.
          </p>
        </section>

        {/* The receipt — 1k2rich */}
        <section data-reveal className="pb-20">
          <SectionHeader index="01" label="THE RECEIPT" meta="// LIVE + PUBLIC" />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <a
                href="https://1k2rich.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-charcoal overflow-hidden"
              >
                <div className="relative aspect-[16/10] bg-line">
                  <img
                    src="/projects/1k2rich/hero.webp"
                    alt="1k2rich — public trading bot journal"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-snap ease-snap group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-charcoal px-5 py-4">
                  <p className="font-display text-2xl">1k2rich</p>
                  <span className="label group-hover:text-charcoal">VISIT →</span>
                </div>
              </a>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4">
              <p className="text-lg leading-relaxed text-charcoal/85">
                a $1,000 bankroll traded by a bot i built — low-DTE options on
                QQQ through a broker api. every position, win or loss, posted
                in public. no cherry-picking. that's the standard your bot
                gets built to.
              </p>
              <p className="text-charcoal/80 leading-relaxed">
                the same class of build ran a paper-trading bot on SPY — watch
                signals, size the entry, log every decision, prove the edge
                before real dollars ride it.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section data-reveal className="pb-20">
          <SectionHeader index="02" label="HOW A BOT GETS BUILT" />
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
            {PROCESS.map((p, i) => (
              <li key={p.step} className="bg-bone p-6 flex flex-col gap-3 min-h-[160px]">
                <p className="label">
                  {String(i + 1).padStart(2, "0")} / {p.step}
                </p>
                <p className="text-charcoal/85 leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 label text-smoke max-w-2xl">
            // not financial advice. i don't pick your strategy or promise
            returns — i build the machine to your spec, and the market does
            what it does.
          </p>
        </section>

        {/* Inquiry */}
        <section data-reveal className="pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <SectionHeader index="03" label="START ONE" />
            <p className="mt-6 text-lg leading-relaxed text-charcoal/80 max-w-md">
              bring the edge you already trade by hand. i'll tell you straight
              whether it's automatable, what it costs, and how long it takes.
            </p>
            <div className="mt-6">
              <Button href="/#showroom" variant="ghost">
                OR SEE THE WEBSITES →
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <InquiryForm
              topic="bot"
              templateSlug="trading-bot"
              templateTitle="trading bot"
            />
          </div>
        </section>

        <footer className="hairline mt-12 mb-12 pt-8 flex flex-col gap-2">
          <p className="label">— walkperro / for the ones who do</p>
          <p className="label">© 2026 walkperro / ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </main>
  );
}
