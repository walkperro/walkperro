import fs from "node:fs";

const file = "app/page.tsx";
let src = fs.readFileSync(file, "utf8");

// 1) Remove any previous buy() and loadingSku state to avoid duplicates
src = src.replace(/const\s*\[\s*loadingSku\s*,\s*setLoadingSku\s*\][^\n]*\n/g, "");
src = src.replace(/async\s+function\s+buy\([\s\S]*?\}\s*\n/g, "");

// 2) Find component and inject a clean state+buy() just before its first "return ("
const compStart = src.indexOf("export default function HomePage");
if (compStart === -1) {
  console.error("Could not find HomePage component");
  process.exit(1);
}
const returnIdx = src.indexOf("return (", compStart);
if (returnIdx === -1) {
  console.error('Could not find "return (" inside HomePage');
  process.exit(1);
}
const before = src.slice(0, returnIdx);
const after = src.slice(returnIdx);

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
// only add the block if it's not already there
if (!before.includes("async function buy(")) {
  merged += injection;
}
merged += after;

// 3) Fix the malformed Manifesto nav if it still exists
merged = merged.replace(
  /<a href="#bundle" className="hover:text-slate-900">\s*Bundle\s*<\/a>\s*Manifesto\s*<\/a>\s*<a href="\/blog"/s,
  `<a href="#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
            <a href="/blog"`
);

// 4) Ensure the component has a closing brace at end of file
const trimmed = merged.trimEnd();
if (!trimmed.endsWith("}")) {
  merged = trimmed + "\n}\n";
}

fs.writeFileSync(file, merged);
console.log("✅ app/page.tsx fixed and balanced");
