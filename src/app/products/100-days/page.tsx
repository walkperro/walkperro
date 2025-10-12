import Reviews from "@/components/Reviews"
export const metadata = { title: "$100 Days Tracker | WalkPerro", description: "Build momentum, stack wins, and hit $100 days with WalkPerro.", openGraph: { images: ["/og-100days.png"] } };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold">$100 Days Tracker</h1>
      <p className="mt-3 text-zinc-600">90-day action system: daily targets, weekly reviews, momentum compounding.</p>
          <Reviews slug="100-days" />
          <Reviews slug="100-days" />
    </main>
  );
}
