create table if not exists editorial_topics (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  topic_slug text not null,
  topic_title text not null,
  topic_summary text,
  topic_angle text,
  article_title text,
  article_objective text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_key, topic_slug)
);

create table if not exists editorial_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  topic_id uuid references editorial_topics(id) on delete set null,
  topic_slug text not null,
  asset_type text not null check (asset_type in ('image')),
  status text not null default 'generated'
    check (status in ('generated', 'approved', 'discarded')),
  visual_direction text,
  prompt text not null,
  revised_prompt text,
  image_url text not null,
  storage_key text not null,
  provider text not null,
  model text,
  width integer,
  height integer,
  quality text,
  output_format text,
  created_at timestamptz not null default now()
);

create table if not exists editorial_channel_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  topic_id uuid references editorial_topics(id) on delete cascade,
  asset_id uuid references editorial_assets(id) on delete set null,
  channel text not null
    check (channel in ('email', 'whatsapp', 'linkedin')),
  headline text,
  body text,
  cta text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists editorial_generation_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  topic_id uuid references editorial_topics(id) on delete set null,
  action text not null,
  success boolean not null default false,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists editorial_assets_tenant_topic_created_idx
  on editorial_assets (tenant_key, topic_slug, created_at desc);

create index if not exists editorial_generation_logs_rate_limit_idx
  on editorial_generation_logs (tenant_key, action, success, created_at desc);

create index if not exists editorial_channel_versions_topic_channel_idx
  on editorial_channel_versions (topic_id, channel, created_at desc);
