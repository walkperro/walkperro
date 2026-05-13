// Minimal types for the `walkperro` schema. Hand-written; keeps Supabase client query
// results properly typed without running the Supabase CLI codegen.

export type Subscriber = {
  id: string;
  email: string;
  source: string;
  status: string;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  body_md: string;
  status: "draft" | "scheduled" | "published" | string;
  scheduled_for: string | null;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type NowStrip = {
  id: string;
  building: string | null;
  reading: string | null;
  listening: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Tool = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLIC" | "LIVE" | "BETA" | string;
  url: string | null;
  file_path: string | null;
  price_cents: number;
  stripe_price_id: string | null;
  requires_email: boolean;
  download_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ToolDownload = {
  id: string;
  tool_id: string;
  subscriber_id: string | null;
  email: string;
  stripe_payment_intent_id: string | null;
  amount_paid_cents: number;
  download_token: string;
  token_expires_at: string;
  downloaded_at: string | null;
  created_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  password_hash: string;
  totp_secret: string | null;
  totp_enabled: boolean;
  backup_codes: string[];
  last_login_at: string | null;
  last_login_ip: string | null;
  failed_login_count: number;
  locked_until: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminSession = {
  id: string;
  admin_user_id: string;
  session_token_hash: string;
  ip_address: string | null;
  user_agent: string | null;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
};

export type AdminAuditLog = {
  id: string;
  admin_user_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type PasswordReset = {
  id: string;
  admin_user_id: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
};

// Supabase Database<S> typings — minimal but enough for queries
export type Database = {
  walkperro: {
    Tables: {
      subscribers:       { Row: Subscriber;       Insert: Partial<Subscriber>; Update: Partial<Subscriber> };
      posts:             { Row: Post;             Insert: Partial<Post>;       Update: Partial<Post> };
      now_strip:         { Row: NowStrip;         Insert: Partial<NowStrip>;   Update: Partial<NowStrip> };
      tools:             { Row: Tool;             Insert: Partial<Tool>;       Update: Partial<Tool> };
      tool_downloads:    { Row: ToolDownload;     Insert: Partial<ToolDownload>; Update: Partial<ToolDownload> };
      admin_users:       { Row: AdminUser;        Insert: Partial<AdminUser>;  Update: Partial<AdminUser> };
      admin_sessions:    { Row: AdminSession;     Insert: Partial<AdminSession>; Update: Partial<AdminSession> };
      admin_audit_log:   { Row: AdminAuditLog;    Insert: Partial<AdminAuditLog>; Update: Partial<AdminAuditLog> };
      password_resets:   { Row: PasswordReset;    Insert: Partial<PasswordReset>; Update: Partial<PasswordReset> };
    };
    Views: Record<string, never>;
    Functions: {
      bump_rate_limit: {
        Args: { p_key: string; p_window_seconds: number; p_max: number };
        Returns: { current_count: number; limited: boolean }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
