import "server-only";

const SUPABASE_SERVER_ENV_NAMES = ["SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;

export function getMissingSupabaseServerEnvVars() {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) {
    missing.push("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  return missing;
}

function pickSupabaseRestBaseUrl() {
  const candidates = [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_URL].filter(
    (value): value is string => Boolean(value),
  );

  for (const value of candidates) {
    try {
      const parsed = new URL(value);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.toString().replace(/\/$/, "");
      }
    } catch {
      // Ignore invalid URL strings (e.g. postgres connection strings)
    }
  }

  return null;
}

export function formatSupabaseServerEnvError() {
  const missing = getMissingSupabaseServerEnvVars();
  if (missing.length === 0) {
    return `Supabase server env vars are required: ${SUPABASE_SERVER_ENV_NAMES.join(", ")}.`;
  }
  return `Missing Supabase server env vars: ${missing.join(", ")}.`;
}

export function getSupabaseServerConfig() {
  const supabaseUrl = pickSupabaseRestBaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error(formatSupabaseServerEnvError());
  return { supabaseUrl, serviceRoleKey };
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
  const requestUrl = `${supabaseUrl}/rest/v1/${opts.path}`;
  let res: Response;
  try {
    res = await fetch(requestUrl, {
      method,
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Accept: opts.accept || "application/json",
        "Accept-Profile": opts.schema,
        ...(isWrite ? { Prefer: opts.prefer || "return=representation" } : {}),
        ...(isWrite ? { "Content-Profile": opts.schema } : {}),
      },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Supabase REST ${method} ${opts.path} network error: ${detail}`);
  }

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
