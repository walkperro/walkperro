import { randomToken, hmac } from "@/lib/encryption";

export const PENDING_COOKIE = "wp_admin_pending";
export const PENDING_TTL = 5 * 60; // 5 minutes

export function createPendingToken(userId: string): string {
  const nonce = randomToken(16);
  const exp = Date.now() + PENDING_TTL * 1000;
  const payload = `${userId}.${exp}.${nonce}`;
  const sig = hmac(payload);
  return `${payload}.${sig}`;
}

export function verifyPendingToken(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 4) return null;
  const [userId, expStr, nonce, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  const expectedSig = hmac(`${userId}.${expStr}.${nonce}`);
  if (sig !== expectedSig) return null;
  return userId;
}

export function pendingCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: PENDING_TTL,
  };
}
