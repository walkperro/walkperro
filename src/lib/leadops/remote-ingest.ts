export type RemoteLeadOpsIngestPayload = {
  source_project: string;
  source_channel: string;
  source_name?: string;
  source_lead_id?: string;
  source_event_key?: string;
  idempotency_key?: string;
  lead_type?: string;
  industry?: string;
  subindustry?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  company?: string;
  website_url?: string;
  location?: string;
  message?: string;
  timezone?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  tags?: string[];
  categories?: string[];
  normalized_payload?: Record<string, unknown>;
  raw_payload?: Record<string, unknown>;
  existing_score?: number;
};

export async function sendLeadToLeadOpsHub(
  payload: RemoteLeadOpsIngestPayload,
  opts?: { endpoint?: string; ingestKey?: string },
) {
  const endpoint = opts?.endpoint || process.env.LEADOPS_INGEST_ENDPOINT;
  const ingestKey = opts?.ingestKey || process.env.LEADOPS_INGEST_KEY;

  if (!endpoint) throw new Error("LEADOPS_INGEST_ENDPOINT is missing.");
  if (!ingestKey) throw new Error("LEADOPS_INGEST_KEY is missing.");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-leadops-ingest-key": ingestKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    id?: string;
    score?: number;
    priority?: string;
  };

  if (!res.ok || !json.ok) {
    throw new Error(json.error || `LeadOps ingest failed (${res.status}).`);
  }

  return json;
}
