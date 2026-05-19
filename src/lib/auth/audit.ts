import { admin } from "@/lib/supabase/admin";

export type AuditAction =
  | "login"
  | "login_failed"
  | "login_locked"
  | "totp_setup"
  | "totp_failed"
  | "logout"
  | "logout_all"
  | "password_change"
  | "password_reset_request"
  | "password_reset_complete"
  | "post_created"
  | "post_updated"
  | "post_published"
  | "post_auto_published"
  | "post_deleted"
  | "now_updated"
  | "tool_created"
  | "tool_updated"
  | "tool_uploaded"
  | "tool_stripe_synced"
  | "subscriber_exported"
  | "subscriber_deleted"
  | "session_revoked"
  | "settings_changed"
  | "subscribe"
  | "tool_request"
  | "tool_purchase"
  | "tool_download";

export async function audit(
  adminUserId: string | null,
  action: AuditAction,
  details: Record<string, unknown> = {},
  context?: { ip?: string | null; userAgent?: string | null }
): Promise<void> {
  try {
    await admin().from("admin_audit_log").insert({
      admin_user_id: adminUserId,
      action,
      details,
      ip_address: context?.ip || null,
      user_agent: context?.userAgent || null,
    });
  } catch (e) {
    console.warn("audit insert failed:", e);
  }
}
