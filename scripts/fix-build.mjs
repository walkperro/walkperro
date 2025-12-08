import fs from "node:fs";

// ---- Fix app/page.tsx (dedupe loadingSku + buy())
const pagePath = "app/page.tsx";
let src = fs.readFileSync(pagePath, "utf8");

// remove ALL buy() definitions (we'll reinsert a clean one)
src = src.replace(/async function buy\([\s\S]*?\}\s*\n/g, "");

// remove ALL loadingSku state lines
src = src.replace(/const \[loadingSku,\s*setLoadingSku\][^\n]*\n/g, "");

// insert a single state + buy() right after openSlug state
src = src.replace(
  /const \[openSlug,\s*setOpenSlug\]\s*=\s*useState<string \| null>\(null\);\s*\n/,
  (m) =>
    m +
    `  const [loadingSku, setLoadingSku] = useState<string | null>(null);
  async function buy(priceId: string) {
    try {
      setLoadingSku(priceId);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceIds: [priceId] })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingSku(null);
    }
  }
`
);

// optional: ensure Manifesto link is properly closed if the earlier malformed anchor still exists
src = src.replace(
  /<a href="#bundle" className="hover:text-slate-900">\s*Bundle\s*<\/a>\s*Manifesto\s*<\/a>\s*<a href="\/blog"/s,
  `<a href="#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
            <a href="/blog"`
);

fs.writeFileSync(pagePath, src);
console.log("Patched app/page.tsx ✓");

// ---- Fix webhook template literal (use string concat to be safe)
const hookPath = "app/api/webhooks/stripe/route.ts";
if (fs.existsSync(hookPath)) {
  let hook = fs.readFileSync(hookPath, "utf8");
  hook = hook.replace(
    /return new Response\(`Webhook Error: \$\{.*?message\}`,\s*\{ status:\s*400 \}\);/s,
    'return new Response("Webhook Error: " + (err as any).message, { status: 400 });'
  );
  fs.writeFileSync(hookPath, hook);
  console.log("Patched webhook route ✓");
} else {
  console.log("Webhook route not found at", hookPath);
}
