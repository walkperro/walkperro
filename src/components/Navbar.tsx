import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-zinc-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-extrabold tracking-tight text-xl">
          WALK<span className="text-emerald-600">PERRO</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:text-emerald-600">Products</Link>
          <Link href="/blog" className="hover:text-emerald-600">Journal</Link>
          <Link href="/contact" className="rounded-lg bg-black px-3 py-1.5 text-white hover:bg-zinc-800">
            Get in touch
          </Link>
        </div>
      </nav>
    </header>
  );
}
