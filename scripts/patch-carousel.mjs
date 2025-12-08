import fs from "node:fs";

const file = "src/components/Carousel3D.tsx";
if (!fs.existsSync(file)) {
  console.error("❌ Not found:", file);
  process.exit(1);
}

let s = fs.readFileSync(file, "utf8");

// Ensure we can import the canonical Product type
if (!/from\s+["']@\/lib\/products["']/.test(s)) {
  s = s.replace(
    /(^\s*import[^\n]*\n)+/m,
    (m) => m + `import type { Product } from "@/lib/products";\n`
  );
}

// Replace any local Item type with Product + legacy optional fields
if (/type\s+Item\s*=/.test(s)) {
  s = s.replace(
    /type\s+Item\s*=\s*{[\s\S]*?};/m,
    `type Item = Product & {
  // legacy props kept optional for backward compatibility
  payhipUrl?: string;
  payhipProductId?: string;
};`
  );
} else {
  // If Item isn't defined, define it
  s = `import type { Product } from "@/lib/products";\n` + s;
  s = s.replace(
    /(^\s*export\s+default\s+function|\nexport\s+default\s+function)/,
    `\ntype Item = Product & { payhipUrl?: string; payhipProductId?: string };\n$1`
  );
}

// (Safety) Loosen props typing if it was too strict
s = s.replace(
  /(\bitems\s*:\s*)Item\[\]/,
  `$1Item[]`
);

fs.writeFileSync(file, s);
console.log("✅ Patched", file);
