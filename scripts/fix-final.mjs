import fs from "node:fs";

// ---- 1) Fix webhook file by overwriting with a safe version (no template literals)
const hookPath = "app/api/webhooks/stripe/route.ts";
const hookSafe = `import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  try {
    stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return new Response("Webhook Error: " + (err?.message ?? "unknown"), { status: 400 });
  }
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
`;
try {
  fs.mkdirSync("app/api/webhooks/stripe", { recursive: true });
  fs.writeFileSync(hookPath, hookSafe);
  console.log("✓ Rewrote", hookPath);
} catch (e) {
  console.error("Webhook rewrite failed:", e);
}

// ---- 2) Clean up app/page.tsx: dedupe loadingSku/buy() and remove stray brace before return(
const pagePath = "app/page.tsx";
let src = fs.readFileSync(pagePath, "utf8");

// remove ALL buy() definitions
src = src.replace(/async function buy\([\s\S]*?\n}\s*\n/g, "");

// remove ALL loadingSku state lines
src = src.replace(/const \[\s*loadingSku\s*,\s*setLoadingSku\s*\][^\n]*\n/g, "");

// insert a single state + buy() right after openSlug state
src = src.replace(
  /const \[\s*openSlug\s*,\s*setOpenSlug\s*\]\s*=\s*useState<string \| null>\(null\);\s*\n/,
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

// fix malformed Manifesto link if still present
src = src.replace(
  /<a href="#bundle" className="hover:text-slate-900">\s*Bundle\s*<\/a>\s*Manifesto\s*<\/a>\s*<a href="\/blog"/s,
  `<a href="#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
            <a href="/blog"`
);

// remove any lone closing brace immediately before the component's return(
src = src.replace(/\n}\s*\n\s*return\s*\(/, `

  return (`
);

fs.writeFileSync(pagePath, src);
console.log("✓ Patched", pagePath);
