"use client";

import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col px-4 pb-24 pt-12 sm:px-6 lg:px-0">

        {/* Top nav (same as home) */}
        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg md:text-base font-semibold tracking-tight"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm">
              W
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <a href="/#exhibit" className="hover:text-slate-900">Exhibit</a>
            <a href="/#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
            <a href="/services" className="text-slate-900 font-semibold">Services</a>
          </nav>
        </header>

        {/* Hero */}
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            WalkPerro Services
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Clean systems. Quiet execution. Real results.
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
            Clean systems that compound: storefronts, SEO, analytics, social automations,
            chatbots, and affiliate engines—delivered fast and clearly.
            Everything handled through clean, organized messaging.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href="#tiers"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold tracking-[0.15em] text-white transition hover:bg-slate-800"
            >
              SEE PACKAGES
            </a>
            <a
              href="#start"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold tracking-[0.15em] text-slate-700 transition hover:border-slate-400"
            >
              START YOUR PROJECT
            </a>
          </div>
        </section>

        {/* Core services — NO fade on first content block */}
        <section className="mt-14 space-y-6 sr-ignore">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Core Services
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Online Store Setup */}
            <article className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
              <h2 className="text-2xl font-semibold">
                Online Store Setup (Next.js, Payhip, Shopify)
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                Aesthetic, fast, conversion-ready storefronts. Built to look premium and sell quietly.
              </p>
              <ul className="mt-5 space-y-2 text-[15px] text-slate-700">
                <li>• Framework/setup tailored to your stack</li>
                <li>• Mobile-first, speed-optimized</li>
                <li>• Clean product/offer pages</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                START BUILD →
              </a>
            </article>

            {/* SEO + Analytics */}
            <article className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
              <h2 className="text-2xl font-semibold">SEO + Analytics Setup</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                Search visibility + tracking that actually informs your moves.
              </p>
              <ul className="mt-5 space-y-2 text-[15px] text-slate-700">
                <li>• Titles, meta, OpenGraph</li>
                <li>• Product JSON-LD</li>
                <li>• GA4 + events + dashboards</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                IMPROVE SEO →
              </a>
            </article>

            {/* Brand Kit */}
            <article className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
              <h2 className="text-2xl font-semibold">Brand Identity Kit</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                Colors, type, iconography, and a tight aesthetic system.
              </p>
              <ul className="mt-5 space-y-2 text-[15px] text-slate-700">
                <li>• Logo marks + usage</li>
                <li>• Color + type scale</li>
                <li>• Social + ad templates</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                DESIGN MY KIT →
              </a>
            </article>

            {/* Chatbot */}
            <article className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
              <h2 className="text-2xl font-semibold">AI Chatbot (Build + Integration)</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                A trained assistant to answer questions, capture leads, and guide purchases.
              </p>
              <ul className="mt-5 space-y-2 text-[15px] text-slate-700">
                <li>• Trained on your brand content</li>
                <li>• Website or DM integration</li>
                <li>• Conversational flows that convert</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                ADD A CHATBOT →
              </a>
            </article>

            {/* Social Automation */}
            <article className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
              <h2 className="text-2xl font-semibold">Social Automation</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                A light posting engine to keep you visible without burnout.
              </p>
              <ul className="mt-5 space-y-2 text-[15px] text-slate-700">
                <li>• Content calendars + hooks</li>
                <li>• Templates that fit your style</li>
                <li>• Auto-posting on 1–2 platforms</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                SET UP POSTS →
              </a>
            </article>

            {/* Affiliate Engine */}
            <article className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
              <h2 className="text-2xl font-semibold">Affiliate Engine</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                Tasteful loops that turn content and traffic into recurring commissions.
              </p>
              <ul className="mt-5 space-y-2 text-[15px] text-slate-700">
                <li>• Landing + “What I use” sections</li>
                <li>• Link management + UTMs</li>
                <li>• Subtle placement, high trust</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                BUILD MY LOOP →
              </a>
            </article>
          </div>
        </section>

        {/* Subscription tiers */}
        <section id="tiers" className="mt-20 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Subscription Tiers
          </p>
          <p className="text-sm text-slate-500">
            Predictable billing • Effective planning
          </p>

          <div className="mt-2 grid gap-6 md:grid-cols-2">
            {/* Starter */}
            <article className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
              <h3 className="text-xl font-semibold">Starter Build</h3>
              <p className="mt-1 text-slate-600">For people who just need direction + light setup.</p>
              <p className="mt-4 text-3xl font-semibold">$99/mo</p>
              <ul className="mt-5 space-y-2 text-[15px] text-slate-700">
                <li>• Mini site audit or 1-page landing</li>
                <li>• SEO meta & OpenGraph</li>
                <li>• GA4 installed + monthly report</li>
                <li>• 1 DM strategy session</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                CHOOSE STARTER
              </a>
            </article>

            {/* Growth */}
            <article className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)]">
              <div className="mb-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                BEST VALUE
              </div>
              <h3 className="text-xl font-semibold">Growth Engine</h3>
              <p className="mt-1 text-slate-600">For creators or businesses ready to expand.</p>
              <p className="mt-4 text-3xl font-semibold">$249/mo</p>
              <ul className="mt-5 space-y-2 text-[15px] text-slate-700">
                <li>• Full SEO pass + indexing</li>
                <li>• 1 blog post/month (you draft, I polish)</li>
                <li>• Auto-posting (1–2 platforms)</li>
                <li>• DM support + monthly optimization</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                CHOOSE GROWTH
              </a>
            </article>

            {/* Domination */}
            <article className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100 md:col-span-2">
              <h3 className="text-xl font-semibold">Brand Domination</h3>
              <p className="mt-1 text-slate-600">The full “done-with-you” digital engine.</p>
              <p className="mt-4 text-3xl font-semibold">$499/mo</p>
              <ul className="mt-5 grid gap-2 text-[15px] text-slate-700 md:grid-cols-2">
                <li>• Website creation or rebuild</li>
                <li>• SEO + metadata + indexing</li>
                <li>• Social posting system (daily cadence)</li>
                <li>• Custom AI chatbot (trained on your brand)</li>
                <li>• Affiliate engine setup</li>
                <li>• Priority support via DM</li>
              </ul>
              <a
                href="#start"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-white hover:bg-slate-800"
              >
                CHOOSE DOMINATION
              </a>
            </article>
          </div>
        </section>

        {/* Billing & Onboarding */}
        <section id="billing" className="mt-20">
          <div className="rounded-3xl bg-white p-7 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
            <h3 className="text-2xl font-semibold">Billing & Onboarding</h3>
            <ul className="mt-4 space-y-3 text-[15px] text-slate-700">
              <li>• We align in DMs on scope, timeline, and deliverables.</li>
              <li>• For subscriptions: quick checkout via Payhip membership link (renews monthly, cancel anytime).</li>
              <li>• For one-time projects: I send a Payhip invoice link (or Stripe). Typical split: 50% start / 50% on launch.</li>
              <li>• After payment you’ll get a short intake form + a shared checklist so you can see progress at a glance.</li>
            </ul>
          </div>
        </section>

        {/* Start section */}
        <section id="start" className="mt-16">
          <div className="rounded-3xl bg-slate-900 px-7 py-10 text-white">
            <h3 className="text-2xl font-semibold">Start your project</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-200">
              Send a quick note with your goal and any links. I’ll confirm scope and share a clean plan with exact next steps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="mailto:hello@walkperro.com?subject=Project%20Inquiry"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold tracking-[0.10em] text-slate-900 hover:bg-slate-100"
              >
                EMAIL ME
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
