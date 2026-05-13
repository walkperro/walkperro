// One-time idempotent admin seed.
// Generates a strong random password, bcrypts it (cost 12), inserts the admin_users row,
// and WRITES THE PLAINTEXT PASSWORD TO A CHMOD-600 FILE — never stdout, never logs.
// Stdout only prints the file path and a "rotate this immediately" warning.

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { writeFileSync, chmodSync } from "node:fs";
import { supabase } from "./_supabase.mjs";

const EMAIL = (process.env.ADMIN_INITIAL_EMAIL || "walkperro@proton.me").toLowerCase();
const TMP_PATH = "/tmp/walkperro-admin-temp.txt";

async function main() {
  // 1. Check if admin already exists.
  const { data: existing, error: selErr } = await supabase
    .from("admin_users")
    .select("id, email, totp_enabled")
    .eq("email", EMAIL)
    .maybeSingle();

  if (selErr) {
    console.error("Lookup error:", selErr.message);
    process.exit(2);
  }
  if (existing) {
    console.log(`Admin already exists: ${EMAIL} (id=${existing.id}, totp_enabled=${existing.totp_enabled}).`);
    console.log("Nothing to do. Use /admin/forgot-password to reset.");
    return;
  }

  // 2. Generate a 24-char base64-url password (≈144 bits of entropy).
  const pw = crypto.randomBytes(18).toString("base64url");

  // 3. bcrypt cost 12
  const hash = await bcrypt.hash(pw, 12);

  // 4. Insert admin row.
  const { data: inserted, error: insErr } = await supabase
    .from("admin_users")
    .insert({ email: EMAIL, password_hash: hash })
    .select("id, email")
    .single();

  if (insErr) {
    console.error("Insert error:", insErr.message);
    process.exit(3);
  }

  // 5. Write password to chmod-600 tmp file — NEVER to stdout/logs.
  writeFileSync(TMP_PATH, `email: ${EMAIL}\npassword: ${pw}\nrotate-immediately-on-first-login\n`, {
    mode: 0o600,
  });
  try {
    chmodSync(TMP_PATH, 0o600);
  } catch {}

  // 6. Stdout summary — no secret values.
  console.log("");
  console.log("Admin user created.");
  console.log(`  email: ${EMAIL}`);
  console.log(`  id:    ${inserted.id}`);
  console.log("");
  console.log(`Temp password written to: ${TMP_PATH} (chmod 600)`);
  console.log("  → Read it, copy into your password manager, then:");
  console.log(`     shred -u ${TMP_PATH}   (or: rm -P ${TMP_PATH} on macOS)`);
  console.log("");
  console.log("Log in at /admin/login and CHANGE THIS PASSWORD IMMEDIATELY.");
  console.log("You'll then be forced through 2FA setup.");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
