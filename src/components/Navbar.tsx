import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-zinc-100">
      <nav className="mx-auto max-w-6xl px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/products" className="text-zinc-700 hover:text-black">Products</Link>
          <Link href="/blog" className="text-zinc-700 hover:text-black">Journal</Link>
          <Link
            href="/contact"
            className="rounded-xl bg-black px-5 py-2.5 text-white shadow-sm hover:shadow-lg transition-all ml-1"
          >
            Get in touch
          </Link>
        </div>
      </nav>
    </header>
  );
}
