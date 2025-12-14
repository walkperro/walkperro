"use client";
import { useEffect } from "react";
export default function RedirectGuard() {
  useEffect(() => {
    // If the embed created a session and didn't redirect, try to fetch it and force redirect
    const url = new URL(window.location.href);
    if (url.searchParams.get("session_id")) return; // already have it

    const last = sessionStorage.getItem("last_checkout_session_id");
    if (last) {
      const origin = window.location.origin;
      window.location.replace(`${origin}/thanks?session_id=${encodeURIComponent(last)}`);
    }
  }, []);
  return null;
}
