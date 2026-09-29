create extension if not exists pgcrypto;

create table if not exists conversational_demo_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  channel text not null check (channel in ('web', 'whatsapp')),
  external_user_key text not null,
  role text not null default 'patient' check (role in ('patient', 'family', 'secretary')),
  status text not null default 'active' check (status in ('active', 'handoff', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique (tenant_key, channel, external_user_key)
);

create table if not exists conversational_demo_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references conversational_demo_sessions(id) on delete cascade,
  external_message_id text,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists conversational_demo_messages_external_id_uidx
  on conversational_demo_messages(external_message_id)
  where external_message_id is not null;

create index if not exists conversational_demo_messages_session_created_idx
  on conversational_demo_messages(session_id, created_at desc);

create index if not exists conversational_demo_sessions_last_message_idx
  on conversational_demo_sessions(last_message_at desc);

comment on table conversational_demo_sessions is
  'Short-lived sessions for controlled Proxy conversational demos. External user identifiers are stored as hashes, not raw phone numbers.';

comment on table conversational_demo_messages is
  'Short-lived demo conversation transcript used only to preserve conversational context during controlled tests.';
