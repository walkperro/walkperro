import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Centralized service-role Supabase client scoped to the `walkperro` schema.
// Reads SUPABASE_SECRET_KEY (preferred) or SUPABASE_SERVICE_ROLE_KEY for portability.
// Used only on the server.
//
// We intentionally do NOT pass typed generics. Custom schemas (`walkperro`) don't
// fit cleanly into Supabase's <Database, "public"> generic shape without extensive
// codegen — and casting at every call site is worse than casting once here.
// Use the row types in `./types.ts` at consumer sites with `as Foo[]` when needed.

let _client: SupabaseClient | null = null;

export function admin(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!key) throw new Error("Missing SUPABASE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY");
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "walkperro" as never },
  });
  return _client;
}
