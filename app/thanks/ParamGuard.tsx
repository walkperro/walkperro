"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ParamGuard() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const sid =
      sp.get("session_id") ||
      sp.get("checkout_session_id") ||
      sp.get("nxtPsid") ||
      sp.get("sid") ||
      sp.get("session");

    // If Stripe gave us a session id, go straight to /thanks/[sid]
    if (sid && sid.trim()) {
      router.replace(`/thanks/${encodeURIComponent(sid)}`);
      return;
    }

    // Fallback: if embedded checkout stored the session id, use it
    try {
      const last = sessionStorage.getItem("last_checkout_session_id");
      if (last && last.trim()) {
        router.replace(`/thanks/${encodeURIComponent(last)}`);
      }
    } catch {}
  }, [router, sp]);

  return null;
}
