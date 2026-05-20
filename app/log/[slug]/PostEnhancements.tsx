"use client";

// Tiny client island that hydrates interactive bits inside the rendered
// markdown body. Currently: wires up any `<button data-copy-prev-blockquote>`
// embedded in a post to copy the immediately preceding <blockquote> text on
// click. Renders nothing — pure DOM enhancement.
//
// Markdown contract for posts:
//   > the prompt
//   > continues here
//
//   <div data-copy-prompt-wrap class="copy-prompt-row">
//     <button data-copy-prev-blockquote class="copy-prompt-btn" type="button">copy prompt</button>
//   </div>
//
// The wrapper <div> must be the next sibling after the <blockquote>.

import { useEffect } from "react";

export default function PostEnhancements() {
  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      "button[data-copy-prev-blockquote]"
    );
    if (buttons.length === 0) return;

    const cleanups: Array<() => void> = [];

    buttons.forEach((btn) => {
      const handler = async () => {
        const wrap = btn.closest<HTMLElement>("[data-copy-prompt-wrap]");
        const target = (wrap || btn).previousElementSibling as HTMLElement | null;
        if (!target || target.tagName !== "BLOCKQUOTE") return;

        // innerText preserves the visible line breaks the user reads.
        const text = (target.innerText || target.textContent || "").trim();
        if (!text) return;

        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            // Legacy fallback for older browsers without async clipboard.
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
          }

          const original = btn.textContent || "copy prompt";
          btn.textContent = "copied";
          btn.setAttribute("data-copied", "true");
          window.setTimeout(() => {
            btn.textContent = original;
            btn.removeAttribute("data-copied");
          }, 1800);
        } catch (e) {
          console.warn("copy-prompt: clipboard write failed", e);
        }
      };

      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
