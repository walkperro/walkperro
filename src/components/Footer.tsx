import Link from "next/link";
import { site } from "@/app/site";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-600">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Tools to fast-track your vision.</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-zinc-900">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-900">Privacy</Link>
            <Link href="/refunds" className="hover:text-zinc-900">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
