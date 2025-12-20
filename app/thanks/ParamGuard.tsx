"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BAD = new Set(["undefined", "null", "false", "0", ""]);

function cleanSid(v: string | null) {
  if (!v) return null;
  const s = v.trim();
  if (!s) return null;
  if (BAD.has(s.toLowerCase())) return null;
  if (!s.startsWith("cs_")) return null;
  return s;
}

export default function ParamGuard() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const candidate =
      sp.get("session_id") ||
      sp.get("checkout_session_id") ||
      sp.get("sid") ||
      sp.get("session") ||
      sp.get("nxtPsid");

    const sid = cleanSid(candidate);

    if (sid) {
      router.replace(`/thanks/${encodeURIComponent(sid)}`);
      return;
    }

    try {
      const last = cleanSid(sessionStorage.getItem("last_checkout_session_id"));
      if (last) router.replace(`/thanks/${encodeURIComponent(last)}`);
    } catch {}
  }, [router, sp]);

  return null;
}
