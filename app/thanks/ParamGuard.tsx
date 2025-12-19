"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ParamGuard() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sid =
      sp.get("session_id") ||
      sp.get("checkout_session_id") ||
      sp.get("sid") ||
      sp.get("session");

    // If URL already has it, server page will redirect, no need to do anything here.
    if (sid) return;

    // Rescue: Stripe sometimes returns without params.
    try {
      const last = sessionStorage.getItem("last_checkout_session_id");
      if (last) router.replace(`/thanks/${last}`);
    } catch {}
  }, [sp, router]);

  return null;
}
