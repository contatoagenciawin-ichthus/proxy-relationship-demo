import { NextResponse } from "next/server";
import {
  buildEditorialImagePrompt,
  normalizeVisualDirection,
} from "../../../../lib/editorial/build-image-prompt";
import { generateEditorialImage } from "../../../../lib/editorial/openai-image";
import { storeEditorialImage } from "../../../../lib/editorial/blob-storage";
import {
  countRecentImageGenerations,
  hasEditorialDatabase,
  insertEditorialAsset,
  logEditorialGeneration,
  upsertEditorialTopic,
} from "../../../../lib/editorial/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEFAULT_TENANT = "texfield";
const ALLOWED_TOPICS = new Set([
  "automacao",
  "ia-industria",
  "impressao",
  "manutencao",
  "rastreabilidade",
  "mercado",
]);

function mode() {
  return process.env.EDITORIAL_IMAGE_MODE?.trim().toLowerCase() === "live"
    ? "live"
    : "preview";
}

function liveConfig() {
  const missing = [];

  if (!process.env.OPENAI_API_KEY?.trim()) missing.push("OPENAI_API_KEY");
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) missing.push("BLOB_READ_WRITE_TOKEN");
  if (!process.env.DATABASE_URL?.trim()) missing.push("DATABASE_URL");

  return {
    configured: missing.length === 0,
    missing,
  };
}

function safeText(value, maxLength) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}

function parsePayload(payload) {
  const topicSlug = safeText(payload?.topicSlug, 80);
  const topicTitle = safeText(payload?.topicTitle, 180);
  const topicSummary = safeText(payload?.topicSummary, 700);
  const topicAngle = safeText(payload?.topicAngle, 700);
  const articleTitle = safeText(payload?.articleTitle, 240);
  const articleObjective = safeText(payload?.articleObjective, 160);
  const visualDirection = normalizeVisualDirection(payload?.visualDirection);

  if (!ALLOWED_TOPICS.has(topicSlug)) {
    throw new Error("Tema não autorizado para a demonstração.");
  }

  if (!topicTitle || !articleTitle) {
    throw new Error("Tema e título do artigo são obrigatórios.");
  }

  return {
    tenantKey: DEFAULT_TENANT,
    topicSlug,
    topicTitle,
    topicSummary,
    topicAngle,
    articleTitle,
    articleObjective,
    visualDirection,
  };
}

export async function GET() {
  const config = liveConfig();

  return NextResponse.json({
    mode: mode(),
    provider: "openai",
    model:
      process.env.OPENAI_IMAGE_MODEL?.trim() ||
      "gpt-image-2.5-flare",
    liveConfigured: config.configured,
    databaseConfigured: hasEditorialDatabase(),
    storage: "vercel-blob",
  });
}

export async function POST(request) {
  let payload;

  try {
    payload = parsePayload(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Solicitação inválida.",
      },
      { status: 400 },
    );
  }

  const prompt = buildEditorialImagePrompt(payload);
  const currentMode = mode();

  if (currentMode === "preview") {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      generated: false,
      visualDirection: payload.visualDirection,
      prompt,
      message:
        "Prompt visual validado em modo preview. Nenhuma imagem real foi gerada.",
    });
  }

  const config = liveConfig();

  if (!config.configured) {
    return NextResponse.json(
      {
        ok: false,
        mode: "live",
        generated: false,
        message:
          "A geração real ainda não está totalmente configurada.",
        missing: config.missing,
      },
      { status: 503 },
    );
  }

  const hourlyLimit = Math.max(
    1,
    Math.min(
      60,
      Number.parseInt(
        process.env.DEMO_IMAGE_MAX_PER_HOUR || "8",
        10,
      ) || 8,
    ),
  );

  const count = await countRecentImageGenerations({
    tenantKey: payload.tenantKey,
    minutes: 60,
  });

  if (count >= hourlyLimit) {
    return NextResponse.json(
      {
        ok: false,
        mode: "live",
        generated: false,
        message:
          "O limite de geração desta demonstração foi atingido. Tente novamente mais tarde.",
      },
      { status: 429 },
    );
  }

  let topicId = null;

  try {
    topicId = await upsertEditorialTopic(payload);

    const result = await generateEditorialImage({ prompt });
    const assetId = crypto.randomUUID();

    const stored = await storeEditorialImage({
      tenantKey: payload.tenantKey,
      topicSlug: payload.topicSlug,
      assetId,
      bytes: result.bytes,
      outputFormat: result.outputFormat,
    });

    await insertEditorialAsset({
      assetId,
      tenantKey: payload.tenantKey,
      topicId,
      topicSlug: payload.topicSlug,
      visualDirection: payload.visualDirection,
      prompt,
      imageUrl: stored.url,
      storageKey: stored.pathname,
      model: result.model,
      size: result.size,
      quality: result.quality,
      outputFormat: result.outputFormat,
    });

    await logEditorialGeneration({
      tenantKey: payload.tenantKey,
      topicId,
      action: "generate_image",
      success: true,
      input: {
        topicSlug: payload.topicSlug,
        visualDirection: payload.visualDirection,
      },
      output: {
        assetId,
        model: result.model,
        size: result.size,
        quality: result.quality,
      },
    });

    return NextResponse.json({
      ok: true,
      mode: "live",
      generated: true,
      assetId,
      imageUrl: stored.url,
      visualDirection: payload.visualDirection,
      prompt,
      model: result.model,
      size: result.size,
      quality: result.quality,
      message: "Imagem gerada e salva.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha inesperada na geração de imagem.";

    await logEditorialGeneration({
      tenantKey: payload.tenantKey,
      topicId,
      action: "generate_image",
      success: false,
      input: {
        topicSlug: payload.topicSlug,
        visualDirection: payload.visualDirection,
      },
      output: {},
      errorMessage: message,
    }).catch(() => {});

    console.error("Editorial image generation failed", {
      topicSlug: payload.topicSlug,
      message,
    });

    return NextResponse.json(
      {
        ok: false,
        mode: "live",
        generated: false,
        message:
          "Não foi possível gerar a imagem agora.",
      },
      { status: 502 },
    );
  }
}
