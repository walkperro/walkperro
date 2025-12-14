"use client";
import { useEffect } from "react";

export default function RedirectGuard() {
  useEffect(() => {
    // If we're already on /thanks with a session_id, do nothing
    const url = new URL(window.location.href);
    if (url.pathname.startsWith("/thanks") && url.searchParams.get("session_id")) return;

    // If we’re on /checkout and Stripe didn’t append session_id, use the last known one
    if (url.pathname.startsWith("/checkout") && !url.searchParams.get("session_id")) {
      const last = sessionStorage.getItem("last_checkout_session_id");
      if (last) {
        const origin = window.location.origin;
        window.location.replace(`${origin}/thanks?session_id=${encodeURIComponent(last)}`);
      }
    }
  }, []);

  return null;
}
