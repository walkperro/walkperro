import { generateSecret as otpGenerateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";
import { encrypt, decrypt } from "@/lib/encryption";
import crypto from "node:crypto";

const ISSUER = "walkperro";

export function generateSecret(): string {
  return otpGenerateSecret(); // base32, default 20 bytes
}

export function provisionUri(email: string, secret: string): string {
  return generateURI({
    strategy: "totp",
    issuer: ISSUER,
    label: email,
    secret,
  });
}

export async function qrDataUrl(uri: string): Promise<string> {
  return QRCode.toDataURL(uri, {
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#0E0E0E", light: "#F5F1E8" },
  });
}

export function verifyCode(secret: string, code: string): boolean {
  if (!secret || !code) return false;
  try {
    const result = verifySync({
      strategy: "totp",
      secret,
      token: code.trim(),
      epochTolerance: [1, 1], // ±30s
    });
    return result.valid === true;
  } catch {
    return false;
  }
}

export function encryptSecret(secret: string): string {
  return encrypt(secret);
}

export function decryptSecret(blob: string): string {
  return decrypt(blob);
}

/** Generates 10 backup codes (10 chars each, hyphenated). Plaintext only — caller bcrypts before storing. */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const buf = crypto.randomBytes(5).toString("hex").toUpperCase(); // 10 hex chars
    codes.push(`${buf.slice(0, 5)}-${buf.slice(5)}`);
  }
  return codes;
}
