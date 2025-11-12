export default function BundleBanner() {
  return (
    <div className="mt-8 rounded-2xl border border-graphite bg-graphite/40 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-sm tracking-widest uppercase text-silver/80">Bundle & Save</div>
          <div className="text-bone/90">Get the <span className="font-semibold">ALL-IN-ONE Toolkit Bundle</span> and save vs buying individually.</div>
        </div>
        <a
          href="https://payhip.com/b/all-in-one-toolkit-bundle"
          className="inline-flex items-center rounded-2xl px-5 py-2 bg-emerald text-bone hover:bg-bone hover:text-ink transition-colors w-fit"
        >Upgrade →</a>
      </div>
    </div>
  );
}
