import Background from "./Background";

export default function HeroExhibit() {
  return (
    <>
      <Background />
      <header className="mb-16 relative sheen rounded-2xl border border-graphite/60 p-8 md:p-10 bg-graphite/30 backdrop-blur-sm">
        <p className="uppercase tracking-[0.3em] text-silver">WalkPerro</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-semibold">
          The Exhibit — tools for those who lead the pack.
        </h1>
        <p className="mt-4 text-silver/90 max-w-2xl">
          Minimal. Luxurious. Useful. Buy once, use forever.
        </p>
      </header>
    </>
  );
}
