import { redirect } from "next/navigation";
import { getSessionUser, readSessionToken, type AdminUser } from "./sessions";

/**
 * Server-component helper: returns the current admin user or redirects to /admin/login.
 * Pass `redirectTo` to override the post-login destination.
 */
export async function requireAdmin(redirectTo: string = "/admin"): Promise<AdminUser> {
  const token = await readSessionToken();
  const user = await getSessionUser(token);
  if (!user) redirect(`/admin/login?next=${encodeURIComponent(redirectTo)}`);
  return user;
}

/** Pull request context for audit logs. */
export function reqContext(req: { headers: Headers }) {
  return {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    userAgent: req.headers.get("user-agent") || null,
  };
}
