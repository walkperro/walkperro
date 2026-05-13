import { cookies } from "next/headers";
import { admin } from "@/lib/supabase/admin";
import { randomToken, sha256 } from "@/lib/encryption";

export const SESSION_COOKIE = "wp_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type AdminUser = {
  id: string;
  email: string;
  totp_enabled: boolean;
  failed_login_count: number;
  locked_until: string | null;
};

export type SessionRow = {
  id: string;
  admin_user_id: string;
  expires_at: string;
  revoked_at: string | null;
};

/** Creates a session row and returns the raw token (caller sets the cookie). */
export async function createSession(opts: {
  userId: string;
  ip: string | null;
  userAgent: string | null;
}): Promise<{ rawToken: string; row: SessionRow }> {
  const rawToken = randomToken(32); // base64url, 43 chars
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

  const { data, error } = await admin()
    .from("admin_sessions")
    .insert({
      admin_user_id: opts.userId,
      session_token_hash: tokenHash,
      ip_address: opts.ip,
      user_agent: opts.userAgent,
      expires_at: expiresAt,
    })
    .select("id, admin_user_id, expires_at, revoked_at")
    .single();

  if (error || !data) throw new Error(`createSession: ${error?.message || "no row"}`);
  return { rawToken, row: data as SessionRow };
}

/** Returns the AdminUser if the raw token is valid + not expired + not revoked. */
export async function getSessionUser(rawToken: string | undefined): Promise<AdminUser | null> {
  if (!rawToken) return null;
  const tokenHash = sha256(rawToken);
  const supa = admin();

  const { data: session } = await supa
    .from("admin_sessions")
    .select("id, admin_user_id, expires_at, revoked_at")
    .eq("session_token_hash", tokenHash)
    .maybeSingle();

  if (!session) return null;
  if (session.revoked_at) return null;
  if (new Date(session.expires_at) < new Date()) return null;

  const { data: user } = await supa
    .from("admin_users")
    .select("id, email, totp_enabled, failed_login_count, locked_until")
    .eq("id", session.admin_user_id)
    .maybeSingle();

  return (user as AdminUser) || null;
}

/** Slide the session expiry forward by SESSION_TTL_SECONDS. */
export async function slideSession(rawToken: string): Promise<void> {
  const tokenHash = sha256(rawToken);
  const newExpiry = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await admin()
    .from("admin_sessions")
    .update({ expires_at: newExpiry })
    .eq("session_token_hash", tokenHash);
}

export async function revokeSession(rawToken: string): Promise<void> {
  const tokenHash = sha256(rawToken);
  await admin()
    .from("admin_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("session_token_hash", tokenHash);
}

export async function revokeAllForUser(userId: string): Promise<void> {
  await admin()
    .from("admin_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("admin_user_id", userId)
    .is("revoked_at", null);
}

/** Reads the raw token cookie. Use only from server contexts. */
export async function readSessionToken(): Promise<string | undefined> {
  const c = await cookies();
  return c.get(SESSION_COOKIE)?.value;
}

/** Cookie config for the session cookie. */
export function sessionCookieOptions(): {
  httpOnly: true;
  secure: boolean;
  sameSite: "strict";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
