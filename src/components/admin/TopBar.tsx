"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";

export default function TopBar({ email, title }: { email: string; title: string }) {
  const router = useRouter();
  async function logout() {
    await apiFetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }
  return (
    <div className="flex items-center justify-between border-b border-line py-4 px-8">
      <p className="label">{title}</p>
      <div className="flex items-center gap-6">
        <p className="label text-charcoal">{email}</p>
        <button onClick={logout} className="label hover:text-charcoal underline-offset-2 hover:underline">
          LOGOUT →
        </button>
      </div>
    </div>
  );
}
