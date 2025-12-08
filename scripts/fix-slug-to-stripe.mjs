import fs from "node:fs";

const file = "app/products/[slug]/page.tsx";
if (!fs.existsSync(file)) {
  console.error("❌ Not found:", file);
  process.exit(1);
}

let s = fs.readFileSync(file, "utf8");

// Ensure we can reference your central price map
if (!/from\s+["']@\/lib\/prices["']/.test(s)) {
  s = s.replace(
    /(^\s*import .+\n)+/,
    (m) => m + `import { PRICES } from "@/lib/prices";\n`
  );
}

// Add a helper to map slug -> priceId (only once)
if (!/function\s+priceIdForSlug\s*\(/.test(s)) {
  s = s.replace(
    /export\s+default\s+async\s+function\s+|export\s+default\s+function\s+/,
    `function priceIdForSlug(slug: string) {
  switch (slug) {
    case "10-quick-codes": return PRICES.QUICK_CODES;
    case "wealth-hacks":   return PRICES.WEALTH_HACKS;
    case "money-moves":    return PRICES.MONEY_MOVES;
    case "chatgpt-cash-hacks": return PRICES.CASH_HACKS;
    case "all-in-one":     return PRICES.BUNDLE;
    default: return PRICES.BUNDLE;
  }
}

$&`
  );
}

// Normalize the CheckoutButton import
s = s.replace(
  /import\s+CheckoutButton\s+from\s+["'][^"']+["'];?/,
  `import CheckoutButton from "@/components/CheckoutButton";`
);

// Replace the old <CheckoutButton ... /> block with Stripe props
// Old props looked like: children, payhipCode, slug, title, price
s = s.replace(
  /<CheckoutButton[\s\S]*?\/>/m,
  `            <CheckoutButton
              priceId={priceIdForSlug(product.slug)}
              label={\`Buy Now — $\${typeof product.price === "number" ? product.price.toFixed(2) : String(product.price).replace(/^\$/, "")}\`}
            />`
);

// Save
fs.writeFileSync(file, s);
console.log("✅ Patched", file);
