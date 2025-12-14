"use client";
import { useEffect } from "react";

export default function ClientProbe() {
  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const sid = u.searchParams.get("session_id");
      if (sid) {
        // stash for ParamGuard (belt-and-suspenders)
        sessionStorage.setItem("last_checkout_session_id", sid);
      }
    } catch {}
  }, []);
  return null;
}
