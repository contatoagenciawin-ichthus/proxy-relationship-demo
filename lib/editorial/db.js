import { neon } from "@neondatabase/serverless";

let sqlClient = null;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return null;

  if (!sqlClient) {
    sqlClient = neon(databaseUrl);
  }

  return sqlClient;
}

export function hasEditorialDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function countRecentImageGenerations({
  tenantKey,
  minutes = 60,
}) {
  const sql = getSql();
  if (!sql) return 0;

  const safeMinutes = Math.max(1, Math.min(1440, Number(minutes) || 60));

  const rows = await sql`
    select count(*)::int as count
    from editorial_generation_logs
    where tenant_key = ${tenantKey}
      and action = 'generate_image'
      and success = true
      and created_at >= now() - (${safeMinutes}::text || ' minutes')::interval
  `;

  return Number(rows?.[0]?.count || 0);
}

export async function upsertEditorialTopic({
  tenantKey,
  topicSlug,
  topicTitle,
  topicSummary,
  topicAngle,
  articleTitle,
  articleObjective,
}) {
  const sql = getSql();
  if (!sql) return null;

  const rows = await sql`
    insert into editorial_topics (
      tenant_key,
      topic_slug,
      topic_title,
      topic_summary,
      topic_angle,
      article_title,
      article_objective
    )
    values (
      ${tenantKey},
      ${topicSlug},
      ${topicTitle},
      ${topicSummary || null},
      ${topicAngle || null},
      ${articleTitle || null},
      ${articleObjective || null}
    )
    on conflict (tenant_key, topic_slug)
    do update set
      topic_title = excluded.topic_title,
      topic_summary = excluded.topic_summary,
      topic_angle = excluded.topic_angle,
      article_title = excluded.article_title,
      article_objective = excluded.article_objective,
      updated_at = now()
    returning id
  `;

  return rows?.[0]?.id || null;
}

export async function insertEditorialAsset({
  assetId,
  tenantKey,
  topicId,
  topicSlug,
  visualDirection,
  prompt,
  imageUrl,
  storageKey,
  model,
  size,
  quality,
  outputFormat,
}) {
  const sql = getSql();
  if (!sql) return null;

  const [width, height] = String(size || "")
    .split("x")
    .map((value) => Number.parseInt(value, 10));

  await sql`
    insert into editorial_assets (
      id,
      tenant_key,
      topic_id,
      topic_slug,
      asset_type,
      status,
      visual_direction,
      prompt,
      image_url,
      storage_key,
      provider,
      model,
      width,
      height,
      quality,
      output_format
    )
    values (
      ${assetId},
      ${tenantKey},
      ${topicId},
      ${topicSlug},
      'image',
      'generated',
      ${visualDirection},
      ${prompt},
      ${imageUrl},
      ${storageKey},
      'openai',
      ${model},
      ${Number.isFinite(width) ? width : null},
      ${Number.isFinite(height) ? height : null},
      ${quality || null},
      ${outputFormat || null}
    )
  `;

  return assetId;
}

export async function logEditorialGeneration({
  tenantKey,
  topicId,
  action,
  success,
  input,
  output,
  errorMessage,
}) {
  const sql = getSql();
  if (!sql) return;

  await sql`
    insert into editorial_generation_logs (
      tenant_key,
      topic_id,
      action,
      success,
      input,
      output,
      error_message
    )
    values (
      ${tenantKey},
      ${topicId},
      ${action},
      ${Boolean(success)},
      ${JSON.stringify(input || {})}::jsonb,
      ${JSON.stringify(output || {})}::jsonb,
      ${errorMessage || null}
    )
  `;
}
