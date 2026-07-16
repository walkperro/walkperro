import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureCreator } from "@/lib/creator/session";

// OAuth / magic-link callback. Exchanges the code for a session (sets cookies),
// ensures a creators row exists, then redirects into the app.
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app/new";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      try {
        await ensureCreator(data.user);
      } catch {
        // Non-fatal: the app-home loader will retry ensuring the row.
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
