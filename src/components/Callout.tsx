import Link from "next/link";

export default function Callout() {
  return (
    <section className="mx-auto mt-14 max-w-6xl px-6">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-500 p-[1px]">
        <div className="rounded-3xl bg-white p-8 md:p-12">
          <h3 className="text-2xl font-bold tracking-tight">Join the Pack</h3>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Store checkout is activating. Get early updates, free drops, and launch codes.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-xl bg-black px-5 py-2 text-white hover:bg-zinc-800"
          >
            Get notified
          </Link>
        </div>
      </div>
    </section>
  );
}
