"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Variant = "light" | "dark";

type Props = {
  source: string;
  placeholder?: string;
  cta?: string;
  variant?: Variant;
  className?: string;
};

export default function EmailCapture({
  source,
  placeholder = "you@operator.com",
  cta = "Subscribe",
  variant = "light",
  className,
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error();
      setState("ok");
      setEmail("");
    } catch {
      setState("err");
    }
  }

  const isDark = variant === "dark";

  if (state === "ok") {
    return (
      <p className={cn("label", isDark ? "text-bone" : "text-charcoal", className)}>
        // YOU'RE IN. CHECK YOUR EMAIL.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col sm:flex-row items-stretch gap-0 max-w-lg",
        className
      )}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        aria-label="Email address"
        className={cn(
          "flex-1 px-4 py-3 font-mono text-sm bg-transparent border focus:outline-none",
          isDark
            ? "border-line-dark text-bone placeholder:text-smoke focus:border-signal"
            : "border-charcoal text-charcoal placeholder:text-smoke focus:border-charcoal"
        )}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className={cn(
          "px-5 py-3 font-mono uppercase tracking-label text-[0.75rem] border border-l-0 sm:border-l-0 transition-colors duration-snap ease-snap",
          isDark
            ? "bg-signal text-charcoal border-signal hover:bg-bone hover:border-bone"
            : "bg-charcoal text-bone border-charcoal hover:bg-signal hover:text-charcoal"
        )}
      >
        {state === "loading" ? "…" : cta}
      </button>
      {state === "err" && (
        <span className="label mt-2 sm:ml-3 sm:mt-3">
          // TRY AGAIN
        </span>
      )}
    </form>
  );
}
