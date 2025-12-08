import fs from "node:fs";

const file = "app/page.tsx";
let src = fs.readFileSync(file, "utf8");

// normalize line endings
src = src.replace(/\r\n/g, "\n");

// 1) remove all prior loadingSku lines and any existing/broken buy() blocks
src = src.replace(/const\s*\[\s*loadingSku\s*,\s*setLoadingSku\s*\][^\n]*\n/g, "");
src = src.replace(/async\s+function\s+buy\s*\([^)]*\)\s*\{[\s\S]*?\}\s*\n?/g, "");

// 2) locate HomePage function and its opening brace
const fnIdx = src.indexOf("export default function HomePage");
if (fnIdx === -1) {
  console.error("Could not find HomePage declaration in app/page.tsx");
  process.exit(1);
}

// find the *first* '{' after the function declaration
let bodyStart = -1;
for (let i = fnIdx; i < src.length; i++) {
  if (src[i] === "{") { bodyStart = i; break; }
}
if (bodyStart === -1) {
  console.error("Could not find HomePage opening brace");
  process.exit(1);
}

// 3) inject clean state + buy() immediately after that '{'
const injection =
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
`;

src = src.slice(0, bodyStart + 1) + injection + src.slice(bodyStart + 1);

// 4) fix malformed Manifesto nav if present
src = src.replace(
  /<a href="#bundle" className="hover:text-slate-900">\s*Bundle\s*<\/a>\s*Manifesto\s*<\/a>\s*<a href="\/blog"/s,
  `<a href="#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
            <a href="/blog"`
);

// 5) global brace balance: add missing closing braces at EOF if needed
let depth = 0;
for (const ch of src) {
  if (ch === "{") depth++;
  else if (ch === "}") depth--;
}
if (depth > 0) {
  src = src.replace(/\s*$/, "") + "\n" + "}\n".repeat(depth);
}

// write back
fs.writeFileSync(file, src);
console.log("✅ Brutal repair applied to app/page.tsx (injected buy(), balanced braces)");
