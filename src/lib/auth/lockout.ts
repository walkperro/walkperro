import { admin } from "@/lib/supabase/admin";

const MAX_FAILURES = 5;
const LOCKOUT_MINUTES = 15;

export type LockState = {
  locked: boolean;
  minutesRemaining: number;
};

export async function getLockState(userId: string): Promise<LockState> {
  const { data } = await admin()
    .from("admin_users")
    .select("locked_until")
    .eq("id", userId)
    .maybeSingle();
  if (!data?.locked_until) return { locked: false, minutesRemaining: 0 };
  const remainingMs = new Date(data.locked_until).getTime() - Date.now();
  if (remainingMs <= 0) return { locked: false, minutesRemaining: 0 };
  return { locked: true, minutesRemaining: Math.ceil(remainingMs / 60000) };
}

export async function recordFailedLogin(userId: string): Promise<LockState> {
  const supa = admin();
  const { data: user } = await supa
    .from("admin_users")
    .select("failed_login_count")
    .eq("id", userId)
    .maybeSingle();
  const next = (user?.failed_login_count || 0) + 1;
  const lockedUntil =
    next >= MAX_FAILURES
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString()
      : null;
  await supa
    .from("admin_users")
    .update({
      failed_login_count: next,
      locked_until: lockedUntil,
    })
    .eq("id", userId);
  return {
    locked: !!lockedUntil,
    minutesRemaining: lockedUntil ? LOCKOUT_MINUTES : 0,
  };
}

export async function clearFailedLogin(userId: string): Promise<void> {
  await admin()
    .from("admin_users")
    .update({ failed_login_count: 0, locked_until: null })
    .eq("id", userId);
}
