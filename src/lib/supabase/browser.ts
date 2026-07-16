import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Browser Supabase client for creator dashboard client components (Supabase
// Auth). Uses the publishable/anon key; runs as `authenticated` after login.

let _client: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  _client = createBrowserClient(url, key, {
    db: { schema: "walkperro" as never },
  }) as unknown as SupabaseClient;
  return _client;
}
