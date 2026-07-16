import type { Metadata } from "next";
import OnboardFlow from "@/components/app/OnboardFlow";

export const metadata: Metadata = {
  title: "demo",
  description:
    "watch walkperro read a creator's whole account and turn it into products they can sell — live, on sample data.",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-bone text-charcoal">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="font-mono text-sm tracking-tight">walkperro</span>
        <span className="label">// live demo</span>
      </header>
      <OnboardFlow demo />
    </main>
  );
}
