# Supabase Storage Setup

1) Create a **private** bucket named `products`.
2) Upload your PDFs with simple keys, e.g.:
   - `all-in-one.pdf`
   - `cash-hacks-25.pdf`
   - `money-moves.pdf`
3) In Stripe, on each **Price** (recommended) set metadata:
   - `fileKey=all-in-one.pdf` (example)
4) (Optional) Create a table `orders` if you want entitlements/history:

```sql
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  email text,
  amount_total bigint,
  currency text,
  created_at timestamptz default now()
);
```