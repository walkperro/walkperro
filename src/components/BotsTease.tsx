import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

// Homepage band for the trading-bot service → /bots. Plan section F.

export default function BotsTease() {
  return (
    <section data-reveal id="bots" className="py-20 border-t border-line">
      <SectionHeader index="03" label="TRADING BOTS" meta="// BUILT TO SPEC" />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
            i also build robots that trade.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal/80 max-w-xl">
            your strategy, coded and backtested, running against a real broker
            while you sleep. watch one trade in public at 1k2rich — every
            position posted, wins and losses.
          </p>
          <p className="mt-6 label">
            <Link
              href="/bots"
              className="border-b border-charcoal text-charcoal hover:text-charcoal/70"
            >
              HOW A BOT GETS BUILT →
            </Link>
          </p>
        </div>
        <div className="md:col-span-5">
          <a
            href="https://1k2rich.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-charcoal overflow-hidden"
          >
            <div className="relative aspect-[16/10] bg-line">
              <img
                src="/showroom/tex/1k2rich.webp"
                alt="1k2rich — public trading bot journal"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-snap ease-snap group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-charcoal px-4 py-3">
              <p className="font-mono text-sm lowercase">1k2rich — live journal</p>
              <span className="label group-hover:text-charcoal">→</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
