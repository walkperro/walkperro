import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function ThanksMissing() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-950 text-slate-100">
      <div className="max-w-md rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10">
        <p className="text-base">Missing session. If you just paid, check your email for your receipt & downloads.</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-emerald-500 px-5 py-2 text-white">Back to home</Link>
      </div>
    </main>
  );
}
