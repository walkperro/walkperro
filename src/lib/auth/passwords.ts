import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const BCRYPT_COST = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

export type PasswordCheck = {
  ok: boolean;
  errors: string[];
};

export function checkComplexity(plain: string): PasswordCheck {
  const errors: string[] = [];
  if (plain.length < 12) errors.push("min 12 characters");
  if (plain.length > 128) errors.push("max 128 characters");
  if (!/[a-z]/.test(plain)) errors.push("needs a lowercase letter");
  if (!/[A-Z]/.test(plain)) errors.push("needs an uppercase letter");
  if (!/[0-9]/.test(plain)) errors.push("needs a digit");
  if (!/[^a-zA-Z0-9]/.test(plain)) errors.push("needs a symbol");
  return { ok: errors.length === 0, errors };
}

/**
 * HIBP k-anonymity check. Returns true if the password appears in known breaches.
 * Soft-fails open on network errors (returns false).
 * https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
export async function isPwned(plain: string): Promise<boolean> {
  try {
    const sha1 = crypto.createHash("sha1").update(plain).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const body = await res.text();
    for (const line of body.split("\n")) {
      const [hash] = line.split(":");
      if (hash.trim().toUpperCase() === suffix) return true;
    }
    return false;
  } catch {
    return false;
  }
}
