import fs from "node:fs";

const file = "app/page.tsx";
let src = fs.readFileSync(file, "utf8");

// 0) normalize CRLF just in case
src = src.replace(/\r\n/g, "\n");

// 1) remove any previous loadingSku state and any buy() definition (even broken)
src = src.replace(/const\s*\[\s*loadingSku\s*,\s*setLoadingSku\s*\][^\n]*\n/g, "");
src = src.replace(/async\s+function\s+buy\s*\([^)]*\)\s*\{[\s\S]*?\}\s*\n/g, "");

// 2) find HomePage component and first "return ("
const compStartIdx = src.indexOf("export default function HomePage");
if (compStartIdx === -1) {
  console.error("Could not find HomePage component start");
  process.exit(1);
}
const firstReturn = src.indexOf("return (", compStartIdx);
if (firstReturn === -1) {
  console.error('Could not find "return (" inside HomePage');
  process.exit(1);
}

// 3) inject a clean block right before the first return(
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
let merged = before + injection + after;

// 4) fix the malformed Manifesto nav if present
merged = merged.replace(
  /<a href="#bundle" className="hover:text-slate-900">\s*Bundle\s*<\/a>\s*Manifesto\s*<\/a>\s*<a href="\/blog"/s,
  `<a href="#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
            <a href="/blog"`
);

// 5) ensure NO stray } appears immediately before return(
merged = merged.replace(/\n}\s*\n\s*return\s*\(/, `

  return (`);

// 6) HARD balance braces from the HomePage start to EOF (naive but effective)
function balanceBraces(s, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < s.length; i++) {
    const ch = s[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
  }
  // if depth > 0, we need to add that many closing braces
  if (depth > 0) {
    s = s.replace(/\s*$/, ""); // trim end
    s += "\n" + ("}\n".repeat(depth));
  }
  return s;
}
const braceStart = merged.indexOf("{", compStartIdx); // first { of HomePage signature
if (braceStart !== -1) {
  merged = balanceBraces(merged, braceStart);
}

// 7) write back
fs.writeFileSync(file, merged);
console.log("✅ Repaired and balanced app/page.tsx");
