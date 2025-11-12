export default function UpsellCard() {
  return (
    <div className="mt-10 rounded-2xl border border-graphite bg-graphite/40 p-6">
      <div className="text-sm tracking-widest uppercase text-silver/80">One-time Offer</div>
      <h2 className="mt-1 text-2xl font-semibold">Upgrade to the ALL-IN-ONE Toolkit Bundle</h2>
      <p className="mt-2 text-silver/90">Unlock every WalkPerro system in one move — best value if you plan to stack cash fast.</p>
      <a
        href="https://payhip.com/b/all-in-one-toolkit-bundle"
        className="mt-4 inline-flex items-center rounded-2xl px-6 py-3 bg-emerald text-bone hover:bg-bone hover:text-ink transition-colors"
      >Add the Bundle →</a>
    </div>
  );
}
