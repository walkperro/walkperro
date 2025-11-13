import Link from "next/link";

export default function ManifestoPage() {
  return (
    <main className="noise-bg min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between pb-6">
          <Link href="/" className="text-[0.7rem] text-bone/60 hover:text-bone">
            ← Back to Exhibit
          </Link>
          <span className="smallcaps text-bone/60">WalkPerro Manifesto</span>
        </header>

        <article className="space-y-6 text-sm text-bone/75">
          <h1 className="font-display text-3xl text-bone">
            For those who lead the pack.
          </h1>
          <p>
            WalkPerro is for the ones who move with intention. Quiet in the
            group chat, loud on the statements. No guru theatrics. No rented
            Lambos. Just clean tools, tight systems and undeniable receipts.
          </p>
          <p>
            The thesis is simple:{" "}
            <span className="text-bone">momentum beats motivation</span>. You
            don&apos;t need a 97-module course. You need a small stack of
            high-leverage moves you can run tonight, refine this week and scale
            over the next 90 days.
          </p>
          <p>
            Every product in the Exhibit is built to respect your taste and your
            time. Minimal visuals. Clear language. Aggressive practicality.
          </p>
          <ul className="space-y-2 text-bone/70">
            <li>• Cashflow first. Aesthetic always.</li>
            <li>• Faceless is fine. Motion is mandatory.</li>
            <li>• Complexity is a tax. Simplicity compounds.</li>
          </ul>
          <p>
            If you&apos;re here, it&apos;s because you know you&apos;re supposed
            to be leading, not lurking. This is your quiet infrastructure for
            that.
          </p>
          <p className="text-bone/55">
            Build small. Move daily. Lead the pack.
          </p>
        </article>

        <footer className="mt-10 border-t border-bone/10 pt-4 text-[0.7rem] text-bone/45">
          <span>WalkPerro • Built for the relentless.</span>
        </footer>
      </div>
    </main>
  );
}
