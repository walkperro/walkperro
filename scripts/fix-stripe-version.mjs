import fs from "node:fs";

const files = [
  "app/api/checkout/route.ts",
  "app/api/webhooks/stripe/route.ts",
  "app/thanks/page.tsx",
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, "utf8");

  // Replace: new Stripe(KEY, { apiVersion: "..." })
  s = s.replace(
    /new Stripe\(\s*process\.env\.STRIPE_SECRET_KEY!\s*,\s*\{\s*apiVersion:\s*"[^"]*"\s*\}\s*\)/g,
    "new Stripe(process.env.STRIPE_SECRET_KEY!)"
  );

  fs.writeFileSync(f, s);
  console.log("patched", f);
}
