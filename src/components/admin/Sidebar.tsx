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

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="w-[220px] shrink-0 border-r border-line min-h-dvh py-6 px-5">
      <Link href="/admin" className="font-mono text-sm tracking-label lowercase block mb-8">
        walkperro / admin
      </Link>
      <ul className="space-y-3">
        {ITEMS.map((it) => {
          const active = pathname === it.href || pathname?.startsWith(it.href + "/");
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`block font-mono text-[0.75rem] tracking-label uppercase py-1.5 px-2 -mx-2 border-l-2 transition-colors ${
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
