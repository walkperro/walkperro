import "server-only";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { admin } from "@/lib/supabase/admin";
import type { Creator } from "@/lib/supabase/types";

// Creator session helpers for /app dashboard routes and route handlers.
// The authenticated user is validated by Supabase Auth; the creator row is
// loaded via the service-role client (keyed by user_id) so it works regardless
// of whether the walkperro schema is exposed to PostgREST.

export type CreatorSession = { user: User; creator: Creator | null };

export async function getCreatorSession(): Promise<CreatorSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await admin()
    .from("creators")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return { user, creator: (data as Creator | null) ?? null };
}

/** Throws UNAUTHENTICATED if there is no logged-in user. */
export async function requireCreator(): Promise<CreatorSession> {
  const session = await getCreatorSession();
  if (!session?.user) throw new Error("UNAUTHENTICATED");
  return session;
}

/**
 * Ensure a creators row exists for a freshly-authenticated user. Called from
 * the auth callback on first login. Idempotent (unique on user_id).
 */
export async function ensureCreator(user: User): Promise<Creator> {
  const existing = await admin()
    .from("creators")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing.data) return existing.data as Creator;

  const { data, error } = await admin()
    .from("creators")
    .insert({
      user_id: user.id,
      email: user.email ?? "",
      display_name:
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        null,
      avatar_url:
        (user.user_metadata?.avatar_url as string | undefined) ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Creator;
}
