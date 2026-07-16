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

// ============================================================================
// Creator platform (migration 0003)
// ============================================================================
export type CreatorPlan = "free" | "pro_29" | "studio_79";
export type SocialPlatform = "tiktok" | "instagram" | "youtube";

export type Creator = {
  id: string;
  user_id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  plan: CreatorPlan | string;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  stripe_account_status: "none" | "onboarding" | "active" | "restricted" | string;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ConnectedAccount = {
  id: string;
  creator_id: string;
  platform: SocialPlatform;
  handle: string;
  profile_url: string;
  bio: string | null;
  follower_count: number | null;
  avatar_url: string | null;
  last_scraped_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PipelineRun = {
  id: string;
  creator_id: string;
  connected_account_id: string | null;
  kind: "analyze" | "refresh" | "generate" | string;
  status: "queued" | "running" | "succeeded" | "failed" | string;
  stage: string | null;
  stage_detail: Record<string, unknown>;
  pct: number;
  apify_run_id: string | null;
  cost_cents: number;
  error: string | null;
  created_at: string;
  finished_at: string | null;
};

export type SourceVideo = {
  id: string;
  connected_account_id: string;
  platform_video_id: string;
  url: string | null;
  caption: string | null;
  hashtags: string[];
  posted_at: string | null;
  views: number | null;
  likes: number | null;
  comments_count: number | null;
  shares: number | null;
  duration_seconds: number | null;
  transcript: string | null;
  transcript_source: "captions" | "actor" | "whisper" | "none" | null;
  extraction: Record<string, unknown> | null;
  top_comments: Record<string, unknown> | null;
  created_at: string;
};

export type VoiceProfile = {
  id: string;
  creator_id: string;
  version: number;
  profile: Record<string, unknown>;
  prompt_prefix: string;
  videos_analyzed: number | null;
  created_at: string;
};

export type ProductOpportunity = {
  id: string;
  creator_id: string;
  pipeline_run_id: string | null;
  title: string;
  angle: string | null;
  description: string | null;
  demand_score: number | null;
  evidence: Record<string, unknown> | null;
  status: "suggested" | "selected" | "dismissed" | string;
  created_at: string;
};

export type ProductFormat = "interactive" | "pdf" | "tool" | "quiz";

export type Product = {
  id: string;
  creator_id: string;
  opportunity_id: string | null;
  slug: string;
  title: string;
  price_cents: number;
  status: "generating" | "review" | "published" | "archived" | string;
  format: ProductFormat | string;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  quality_report: Record<string, unknown> | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductAssetKind =
  | "guide"
  | "workbook"
  | "checklist"
  | "sales_page"
  | "cover"
  | "email_sequence"
  | "launch_script"
  | "course_outline"
  | "tool"
  | "quiz";

export type ProductAsset = {
  id: string;
  product_id: string;
  kind: ProductAssetKind | string;
  version: number;
  content: Record<string, unknown> | null;
  file_path: string | null;
  status: "pending" | "generated" | "approved" | "failed" | string;
  edited_by_creator: boolean;
  created_at: string;
  updated_at: string;
};

export type Storefront = {
  id: string;
  creator_id: string;
  username: string;
  headline: string | null;
  about: string | null;
  theme: Record<string, unknown>;
  custom_domain: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  product_id: string;
  creator_id: string;
  buyer_email: string;
  amount_cents: number;
  currency: string;
  charge_mode: "platform_mor" | "destination" | string;
  application_fee_cents: number;
  net_to_creator_cents: number;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  status: "paid" | "refunded" | "disputed" | string;
  download_token: string | null;
  token_expires_at: string | null;
  downloaded_at: string | null;
  created_at: string;
};

export type Payout = {
  id: string;
  creator_id: string;
  amount_cents: number;
  stripe_transfer_id: string | null;
  status: "pending" | "paid" | "failed" | string;
  created_at: string;
};

export type LedgerEntry = {
  id: string;
  creator_id: string;
  order_id: string | null;
  payout_id: string | null;
  kind: "sale_credit" | "refund_debit" | "payout_debit" | "adjustment" | string;
  amount_cents: number;
  created_at: string;
};

export type CreatorSubscription = {
  id: string;
  creator_id: string;
  stripe_subscription_id: string | null;
  plan: CreatorPlan | string;
  status: "active" | "past_due" | "canceled" | "trialing" | string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type PlanLimit = {
  plan: string;
  max_videos_scraped: number;
  max_whisper_minutes: number;
  max_products: number;
  max_generations_per_month: number;
  revshare_bps: number;
  watermark: boolean;
};

export type WebhookEvent = {
  id: string;
  provider: "stripe" | "stripe_connect" | "apify" | string;
  type: string | null;
  payload: Record<string, unknown> | null;
  processed_at: string;
};
