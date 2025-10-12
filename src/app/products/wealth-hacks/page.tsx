import Reviews from "@/components/Reviews"
export const metadata = { title: "Wealth Hacks (F.A.C.E.) | WalkPerro", description: "Faceless growth systems to scale $5–$9k/mo with WalkPerro.", openGraph: { images: ["/og-wealth-hacks.png"] } };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold">Wealth Hacks (F.A.C.E.)</h1>
      <p className="mt-3 text-zinc-600">Faceless growth systems to scale $5–$9k/mo.</p>
          <Reviews slug="wealth-hacks" />
          <Reviews slug="wealth-hacks" />
    </main>
  );
}
