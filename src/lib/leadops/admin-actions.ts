import { actorFromBasicAuth, assignCategoriesBySlugs, logLeadActivity } from "@/lib/leadops";
import { supabaseRestRequest } from "@/lib/supabase-rest";

export const LEADOPS_STATUSES = ["new", "contacted", "won", "lost", "archived"] as const;
export const LEADOPS_STAGES = ["new", "reviewed", "contacted", "qualified", "proposal", "won", "lost", "nurture", "merged"] as const;
export const LEADOPS_PRIORITIES = ["low", "medium", "high"] as const;
export const LEADOPS_REVIEWS = ["qualified", "nurture", "follow-up", "disqualify"] as const;

export function isUuid(value: string) {
  return /^[0-9a-fA-F-]{36}$/.test(value);
}

export function toStr(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseIdsCsv(input: string) {
  return Array.from(new Set(input.split(",").map((id) => id.trim()).filter(isUuid)));
}

export async function patchLead(leadId: string, body: Record<string, unknown>) {
  const rows = await supabaseRestRequest<Array<{ id: string }>>({
    schema: "leadops",
    method: "PATCH",
    path: `leads?id=eq.${encodeURIComponent(leadId)}`,
    body: { ...body, updated_at: new Date().toISOString() },
  });
  return rows[0];
}

export async function patchLeads(ids: string[], body: Record<string, unknown>) {
  if (!ids.length) return;
  const inList = ids.map((id) => `\"${id}\"`).join(",");
  await supabaseRestRequest({
    schema: "leadops",
    method: "PATCH",
    path: `leads?id=in.(${inList})`,
    body: { ...body, updated_at: new Date().toISOString() },
    prefer: "return=minimal",
  });
}

export async function removeLeadCategories(leadId: string, categoryIds: string[]) {
  if (!categoryIds.length) return;
  const inList = categoryIds.map((id) => `\"${id}\"`).join(",");
  await supabaseRestRequest({
    schema: "leadops",
    method: "DELETE",
    path: `lead_category_links?lead_id=eq.${encodeURIComponent(leadId)}&category_id=in.(${inList})`,
    prefer: "return=minimal",
  });
}

export async function replaceLeadCategoriesBySlugs(leadId: string, slugs: string[], actor: string) {
  const links = await supabaseRestRequest<Array<{ category_id: string; category: { slug: string } | null }>>({
    schema: "leadops",
    path: `lead_category_links?select=category_id,category:categories(slug)&lead_id=eq.${encodeURIComponent(leadId)}`,
  });
  const currentIds = links.map((l) => l.category_id).filter(Boolean);
  await removeLeadCategories(leadId, currentIds);
  await assignCategoriesBySlugs(leadId, slugs, actor);
}

export function getAdminActor(authorization: string | null) {
  return actorFromBasicAuth(authorization);
}

export async function addActivityForLeads(ids: string[], actor: string, action: string, detail: Record<string, unknown>) {
  for (const id of ids) {
    await logLeadActivity(id, action, actor, detail);
  }
}
