# Stripe + Supabase Download Delivery Pack

Detected structure: app router, TypeScript: True, Next: ^16.0.7

## 1) Add env vars
Copy `.env.example.additions` into your env file and fill.

## 2) Copy these files into your repo
- utils/supabaseServer.ts
- app/api/checkout/route.ts
- app/api/webhooks/stripe/route.ts
- app/thanks/page.tsx
- components/BuyButton.tsx

## 3) Stripe
- Create Products + Prices.
- On each Price metadata set `fileKey=your-file.pdf`.

## 4) Supabase
- Private bucket `products` and upload PDFs.

## 5) Webhook
- Point Stripe to `/api/webhooks/stripe` and set the signing secret in env.

## 6) Replace Payhip
- Remove iframe; render `<BuyButton priceIds=['price_xxx'] />`.