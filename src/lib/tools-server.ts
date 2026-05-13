import { admin } from "@/lib/supabase/admin";
import { randomToken } from "@/lib/encryption";

const BUCKET = "tools";
const FREE_TTL_SECONDS = 60 * 60 * 24; // 24h

export type ToolRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  url: string | null;
  file_path: string | null;
  price_cents: number;
  stripe_price_id: string | null;
  requires_email: boolean;
  download_count: number;
};

export async function getPublicTool(slug: string): Promise<ToolRow | null> {
  const { data } = await admin()
    .from("tools")
    .select("id, slug, title, description, status, url, file_path, price_cents, stripe_price_id, requires_email, download_count")
    .eq("slug", slug)
    .maybeSingle();
  if (!data || data.status === "DRAFT") return null;
  return data as ToolRow;
}

export async function createDownloadRow(opts: {
  toolId: string;
  email: string;
  subscriberId?: string | null;
  amountPaidCents?: number;
  stripePaymentIntentId?: string | null;
}): Promise<{ token: string; rowId: string } | null> {
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + FREE_TTL_SECONDS * 1000).toISOString();
  const { data, error } = await admin()
    .from("tool_downloads")
    .insert({
      tool_id: opts.toolId,
      subscriber_id: opts.subscriberId || null,
      email: opts.email,
      stripe_payment_intent_id: opts.stripePaymentIntentId || null,
      amount_paid_cents: opts.amountPaidCents || 0,
      download_token: token,
      token_expires_at: expiresAt,
    })
    .select("id")
    .single();
  if (error || !data) {
    console.error("createDownloadRow", error);
    return null;
  }
  return { token, rowId: data.id };
}

export async function getSignedFileUrl(filePath: string): Promise<string | null> {
  const { data, error } = await admin().storage
    .from(BUCKET)
    .createSignedUrl(filePath, 60); // 60s
  if (error || !data) return null;
  return data.signedUrl;
}
