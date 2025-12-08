import fs from "node:fs";

const filePath = "app/page.tsx";
let src = fs.readFileSync(filePath, "utf8");

// A. add the new field to the Product type
src = src.replace(
  /payhipProductId:\s*string;?/,
  (m) => m + "\n  stripePriceId: string;"
);

// B. inject buy() helper after the openSlug state
src = src.replace(
  /const \[openSlug, setOpenSlug\] = useState<string \| null>\(null\);\s*/,
  (m) =>
    m +
    `
  const [loadingSku, setLoadingSku] = useState<string | null>(null);
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

// C. fix malformed "Manifesto" link in the nav
src = src.replace(
  /<a href="#bundle" className="hover:text-slate-900">\s*Bundle\s*<\/a>\s*Manifesto\s*<\/a>\s*<a href="\/blog"/s,
  `<a href="#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
            <a href="/blog"`
);

// D. convert hero CTA anchor to button that calls buy() with BUNDLE price
src = src.replace(
  /<a\s*href="#bundle"[^>]*>\s*GET THE BUNDLE\s*<\/a>/s,
  `<button onClick={() => buy("price_1SbmGUCCBLLo4EMcI3h2ZHKl")} className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold tracking-[0.15em] text-white transition hover:bg-slate-800">GET THE BUNDLE</button>`
);

// E. add stripePriceId to each product object right after payhipProductId
const injectId = (slug, price) => {
  const re = new RegExp(
    `(slug:\\s*"${slug}"[\\s\\S]*?payhipProductId:\\s*"[^"]*",)`,
    "m"
  );
  src = src.replace(re, `$1\n    stripePriceId: "${price}",`);
};

injectId("10-quick-codes", "price_1SbjuCCCBLLo4EMcvRTE72Ar");
injectId("wealth-hacks", "price_1Sbm8tCCBLLo4EMcp76vrtrw");
injectId("money-moves", "price_1SbmBeCCBLLo4EMc9ueTdbkv");
injectId("chatgpt-cash-hacks", "price_1SbmDoCCBLLo4EMccp2qIyDo");
injectId("all-in-one", "price_1SbmGUCCBLLo4EMcI3h2ZHKl");

// Save
fs.writeFileSync(filePath, src);
console.log("Patched app/page.tsx ✓");
