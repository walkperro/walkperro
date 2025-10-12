import Reviews from "@/components/Reviews"
export const metadata = { title: "WalkPerro All-in-One Bundle", description: "Every product, system, and template in one discounted bundle. Build your empire.", openGraph: { images: ["/og-bundle.png"] } };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold">All-in-One Bundle</h1>
      <p className="mt-3 text-zinc-600">Everything in one pack. Build the whole system fast.</p>
          <Reviews slug="all-in-one-bundle" />
          <Reviews slug="all-in-one-bundle" />
    </main>
  );
}
