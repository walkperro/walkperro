import fs from "node:fs";

const file = "app/products/[slug]/page.tsx";
if (!fs.existsSync(file)) {
  console.error("Not found:", file);
  process.exit(1);
}

let s = fs.readFileSync(file, "utf8");

// Replace the entire <CheckoutButton ... /> block (old props: children/payhipCode/slug/title/price)
s = s.replace(
  /<CheckoutButton[\s\S]*?\/>/m,
  `<CheckoutButton
              priceId={product.stripePriceId}
              label={\`Buy Now — $\${typeof product.price === "number" ? product.price.toFixed(2) : product.price}\`}
            />`
);

// Optional: ensure we import CheckoutButton from the right place
if (!/from\s+["']@\/components\/CheckoutButton["']/.test(s) && !/from\s+["']\.\.\/\.\.\/src\/components\/CheckoutButton["']/.test(s)) {
  // Try to normalize the import to '@/components/CheckoutButton'
  s = s.replace(
    /import\s+CheckoutButton\s+from\s+["'][^"']+["'];?/,
    `import CheckoutButton from "@/components/CheckoutButton";`
  );
}

// Save
fs.writeFileSync(file, s);
console.log("✅ Patched", file);
