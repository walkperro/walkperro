"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { idx: "01", label: "STUDIO",      href: "/admin/studio" },
  { idx: "02", label: "SUBSCRIBERS", href: "/admin/subscribers" },
  { idx: "03", label: "POSTS",       href: "/admin/posts" },
  { idx: "04", label: "NOW",         href: "/admin/now" },
  { idx: "05", label: "TOOLS",       href: "/admin/tools" },
  { idx: "06", label: "CALENDAR",    href: "/admin/calendar" },
  { idx: "07", label: "METRICS",     href: "/admin/metrics" },
  { idx: "08", label: "SETTINGS",    href: "/admin/settings" },
];

export default function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav
      className={`
        fixed inset-y-0 left-0 z-40 w-[260px] bg-bone border-r border-line min-h-dvh py-6 px-5
        transition-transform duration-200 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-[220px] md:shrink-0
      `}
    >
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin" className="font-mono text-sm tracking-label lowercase">
          walkperro / admin
        </Link>
        {/* Close button on mobile */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="md:hidden label text-smoke px-2 py-1 -mr-2"
        >
          ✕
        </button>
      </div>
      <ul className="space-y-3">
        {ITEMS.map((it) => {
          const active = pathname === it.href || pathname?.startsWith(it.href + "/");
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                onClick={onClose}
                className={`block font-mono text-[0.75rem] tracking-label uppercase py-2 px-2 -mx-2 border-l-2 transition-colors ${
                  active
                    ? "bg-signal text-charcoal border-charcoal"
                    : "text-smoke hover:text-charcoal border-transparent"
                }`}
              >
                {`// ${it.idx} — ${it.label}`}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
