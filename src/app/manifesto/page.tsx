export const metadata = { title: "Manifesto — WalkPerro" };

export default function Manifesto() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-semibold">The WalkPerro Manifesto</h1>
      <p className="mt-6 text-silver/90">
        WalkPerro is luxury minimalism for the relentless. Black like ambition.
        White like discipline. Emerald like wealth. We don’t chase. We lead.
      </p>
      <div className="mt-8 space-y-4 text-silver">
        <p>We build with taste. Clean systems. Fewer moves, higher leverage.</p>
        <p>We design for speed: buy once, use forever, compound daily.</p>
        <p>We value silence over noise, precision over clutter, results over talk.</p>
        <p>We reward focus. We honor momentum. We lead the pack.</p>
      </div>
      <a href="/" className="inline-block mt-10 rounded-2xl px-6 py-3 bg-emerald text-bone hover:bg-bone hover:text-ink transition-colors">Back to the Exhibit →</a>
    </main>
  );
}
