import Reviews from "@/components/Reviews"
export const metadata = { title: "Money Moves Toolkit | WalkPerro", description: "Templates, scripts, and workflows for real-world side hustles that pay.", openGraph: { images: ["/og-money-moves.png"] } };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold">Money Moves Toolkit</h1>
      <p className="mt-3 text-zinc-600">Templates + scripts for flipping, services, and faceless workflows.</p>
          <Reviews slug="money-moves-toolkit" />
          <Reviews slug="money-moves-toolkit" />
    </main>
  );
}
