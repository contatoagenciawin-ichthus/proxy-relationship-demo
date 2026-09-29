import crypto from "node:crypto";
import { neon } from "@neondatabase/serverless";

let sqlClient;

function sql() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!sqlClient) {
    sqlClient = neon(process.env.DATABASE_URL);
  }

  return sqlClient;
}

export function conversationalDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function externalUserKey(rawId) {
  const secret =
    process.env.WHATSAPP_DEMO_SESSION_SECRET?.trim() ||
    process.env.META_APP_SECRET?.trim();

  if (!secret) {
    throw new Error("WHATSAPP_DEMO_SESSION_SECRET is not configured");
  }

  return crypto
    .createHmac("sha256", secret)
    .update(String(rawId || ""))
    .digest("hex");
}

export async function getOrCreateConversationSession({
  tenantKey,
  channel,
  externalUserKey: userKey,
  role = "patient",
}) {
  const rows = await sql()\`
    insert into conversational_demo_sessions (
      tenant_key,
      channel,
      external_user_key,
      role,
      status,
      updated_at,
      last_message_at
    )
    values (
      \${tenantKey},
      \${channel},
      \${userKey},
      \${role},
      'active',
      now(),
      now()
    )
    on conflict (tenant_key, channel, external_user_key)
    do update set
      updated_at = now(),
      last_message_at = now()
    returning id, role, status, created_at, last_message_at
  \`;

  return rows[0];
}

export async function conversationMessageExists(externalMessageId) {
  if (!externalMessageId) return false;

  const rows = await sql()\`
    select 1
    from conversational_demo_messages
    where external_message_id = \${externalMessageId}
    limit 1
  \`;

  return rows.length > 0;
}

export async function insertConversationMessage({
  sessionId,
  externalMessageId = null,
  role,
  content,
  metadata = {},
}) {
  await sql()\`
    insert into conversational_demo_messages (
      session_id,
      external_message_id,
      role,
      content,
      metadata
    )
    values (
      \${sessionId}::uuid,
      \${externalMessageId},
      \${role},
      \${content},
      \${JSON.stringify(metadata)}::jsonb
    )
    on conflict do nothing
  \`;

  await sql()\`
    update conversational_demo_sessions
    set updated_at = now(), last_message_at = now()
    where id = \${sessionId}::uuid
  \`;
}

export async function loadConversationMessages(sessionId, limit = 12) {
  const cappedLimit = Math.max(1, Math.min(Number(limit) || 12, 20));

  const rows = await sql()\`
    select role, content, created_at
    from (
      select role, content, created_at
      from conversational_demo_messages
      where session_id = \${sessionId}::uuid
      order by created_at desc
      limit \${cappedLimit}
    ) recent
    order by created_at asc
  \`;

  return rows.map((row) => ({
    role: row.role === "assistant" ? "assistant" : "user",
    content: row.content,
  }));
}

export async function setConversationSessionStatus(sessionId, status) {
  const allowed = new Set(["active", "handoff", "closed"]);
  const normalized = allowed.has(status) ? status : "active";

  await sql()\`
    update conversational_demo_sessions
    set status = \${normalized}, updated_at = now()
    where id = \${sessionId}::uuid
  \`;
}

export async function purgeExpiredConversationDemoData(hours = 24) {
  const retentionHours = Math.max(1, Math.min(Number(hours) || 24, 168));

  await sql()\`
    delete from conversational_demo_sessions
    where last_message_at < now() - (\${retentionHours}::text || ' hours')::interval
  \`;
}
