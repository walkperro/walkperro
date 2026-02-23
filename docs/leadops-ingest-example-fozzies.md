# LeadOps Ingest Example (Fozzies / other projects)

Use this from a server route or server action in another project to push leads into WalkPerro LeadOps.

## Required env vars (in the sending project)
- `LEADOPS_INGEST_ENDPOINT` = `https://walkperro.com/api/leadops/ingest`
- `LEADOPS_INGEST_KEY` = same secret as WalkPerro's `LEADOPS_INGEST_KEY`

## Example helper usage

```ts
import { sendLeadToLeadOpsHub } from "@/lib/leadops/remote-ingest";

await sendLeadToLeadOpsHub({
  source_project: "fozzies",
  source_channel: "website-form",
  source_name: "Fozzies Contact Form",
  source_lead_id: localLeadId,
  idempotency_key: `fozzies:${localLeadId}`,
  industry: "restaurant",
  lead_type: "website-build",
  contact_name: name,
  contact_email: email,
  contact_phone: phone,
  company: company || "Fozzies",
  website_url,
  location,
  message,
  utm_source,
  utm_medium,
  utm_campaign,
  referrer,
  tags: ["project-fozzies", "site-form"],
  categories: ["restaurant", "website-form", "website-build"],
  normalized_payload: {
    form_name: "contact",
    preferred_service,
  },
  raw_payload: requestBody,
});
```

## Notes
- Call from server-side only (never expose `LEADOPS_INGEST_KEY` in browser code).
- Use a stable `idempotency_key` to prevent duplicates on retries.
- You can pass your local score via `existing_score` if you already score leads upstream.
