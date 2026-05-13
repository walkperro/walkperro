"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";

export default function TopBar({
  email,
  title,
  onMenu,
}: {
  email: string;
  title: string;
  onMenu?: () => void;
}) {
  const router = useRouter();
  async function logout() {
    await apiFetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }
  return (
    <div className="sticky top-0 z-20 bg-bone border-b border-line">
      <div className="flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 md:px-8 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={onMenu}
            aria-label="Open menu"
            className="md:hidden -ml-1 p-2 label text-charcoal"
          >
            ☰
          </button>
          <p className="label truncate">{title}</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <p className="label text-charcoal hidden sm:block truncate max-w-[200px]">{email}</p>
          <button
            onClick={logout}
            className="label hover:text-charcoal underline-offset-2 hover:underline whitespace-nowrap"
          >
            LOGOUT →
          </button>
        </div>
      </div>
    </div>
  );
}
