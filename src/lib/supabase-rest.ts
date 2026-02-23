export function getSupabaseServerConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase server env vars are missing.");
  return { supabaseUrl: supabaseUrl.replace(/\/$/, ""), serviceRoleKey };
}

type RequestOptions = {
  schema: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  prefer?: string;
  accept?: string;
};

export async function supabaseRestRequest<T = unknown>(opts: RequestOptions): Promise<T> {
  const { supabaseUrl, serviceRoleKey } = getSupabaseServerConfig();
  const method = opts.method || "GET";
  const isWrite = method !== "GET";
  const res = await fetch(`${supabaseUrl}/rest/v1/${opts.path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Accept: opts.accept || "application/json",
      ...(isWrite ? { Prefer: opts.prefer || "return=representation" } : {}),
      ...(method === "GET" ? { "Accept-Profile": opts.schema } : { "Content-Profile": opts.schema }),
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase REST ${method} ${opts.path} failed (${res.status}): ${text}`);
  }

  if (opts.accept === "text/csv") {
    return (await res.text()) as T;
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
