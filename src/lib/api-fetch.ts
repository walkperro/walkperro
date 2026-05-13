"use client";

// Client-side fetch wrapper that auto-attaches CSRF header from cookie.
// Use for all mutating admin requests.

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method || "GET").toUpperCase();
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const headers = new Headers(init.headers || {});
  if (isMutating) {
    const csrf = readCookie("wp_csrf");
    if (csrf) headers.set("x-csrf-token", csrf);
    if (init.body && !headers.has("Content-Type") && !(init.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
  }
  return fetch(input, { ...init, headers, credentials: "same-origin" });
}
