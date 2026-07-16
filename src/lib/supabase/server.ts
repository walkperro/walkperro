import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Cookie-bound Supabase client for the creator dashboard (Supabase Auth).
// Runs as the `authenticated` role, so creator reads go THROUGH owner-scoped
// RLS (see migration 0003). Distinct from src/lib/supabase/admin.ts (service
// role, bypasses RLS) and from the hand-rolled admin auth in src/lib/auth/*.

function publishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key)
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  return key;
}

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  const cookieStore = await cookies();
  return createServerClient(url, publishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll called from a Server Component — safe to ignore; the
          // middleware refreshes the session cookie instead.
        }
      },
    },
    db: { schema: "walkperro" as never },
  }) as unknown as SupabaseClient;
}
