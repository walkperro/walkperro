import fs from "node:fs";

const file = "app/page.tsx";
let src = fs.readFileSync(file, "utf8");

// 1) Remove ALL previous loadingSku lines and ANY existing buy() block (even if broken)
src = src.replace(/const\s*\[\s*loadingSku\s*,\s*setLoadingSku\s*\][^\n]*\n/g, "");
src = src.replace(/async\s+function\s+buy\s*\([^)]*\)\s*\{[\s\S]*?\}\s*/g, "");

// 2) Find HomePage component and its first "return ("
const compIdx = src.indexOf("export default function HomePage");
if (compIdx === -1) {
  console.error("Could not find HomePage component in app/page.tsx");
  process.exit(1);
}
const firstReturn = src.indexOf("return (", compIdx);
if (firstReturn === -1) {
  console.error('Could not find "return (" in HomePage');
  process.exit(1);
}

// 3) Insert a clean state + buy() helper immediately before the first "return ("
const before = src.slice(0, firstReturn);
const after  = src.slice(firstReturn);

const injection = `
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

`;

let merged = before;
// only insert if not already present
if (!before.includes("async function buy(")) merged += injection;
merged += after;

// 4) Fix the malformed Manifesto anchor if it still exists
merged = merged.replace(
  /<a href="#bundle" className="hover:text-slate-900">\s*Bundle\s*<\/a>\s*Manifesto\s*<\/a>\s*<a href="\/blog"/s,
  `<a href="#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
            <a href="/blog"`
);

// 5) Ensure the component ends with a closing brace
const trimmed = merged.trimEnd();
if (!trimmed.endsWith("}")) merged = trimmed + "\n}\n";

// 6) Write back
fs.writeFileSync(file, merged);
console.log("✅ Repaired app/page.tsx (balanced braces, clean buy())");
