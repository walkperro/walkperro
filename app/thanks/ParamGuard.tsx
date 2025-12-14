"use client";
import { useEffect } from "react";

export default function ParamGuard() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const sid = url.searchParams.get("session_id") || url.searchParams.get("sessionId");
    if (sid) return; // already present

    try {
      const last = sessionStorage.getItem("last_checkout_session_id");
      if (last) {
        url.searchParams.set("session_id", last);
        window.location.replace(url.toString());
      }
    } catch { /* ignore */ }
  }, []);
  return null;
}
