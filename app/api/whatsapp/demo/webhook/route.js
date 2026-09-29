import crypto from "node:crypto";
import { NextResponse } from "next/server";

import { getConversationalTenant } from "../../../../../config/conversational-tenants";
import {
  conversationMessageExists,
  conversationalDatabaseConfigured,
  externalUserKey,
  getOrCreateConversationSession,
  insertConversationMessage,
  loadConversationMessages,
  purgeExpiredConversationDemoData,
  setConversationSessionStatus,
} from "../../../../../lib/conversational/db";
import { respondConversationally } from "../../../../../lib/conversational/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function graphVersion() {
  return process.env.WHATSAPP_DEMO_GRAPH_VERSION?.trim() || "v26.0";
}

function demoMode() {
  return process.env.WHATSAPP_DEMO_MODE === "live" ? "live" : "preview";
}

function normalizedAllowedNumbers() {
  return (process.env.WHATSAPP_DEMO_ALLOWED_NUMBERS || "")
    .split(",")
    .map((item) => item.replace(/\D/g, ""))
    .filter(Boolean);
}

function isAllowedNumber(number) {
  const allowed = normalizedAllowedNumbers();
  return allowed.length > 0 && allowed.includes(String(number || "").replace(/\D/g, ""));
}

function verifyWebhookSignature(rawBody, signatureHeader) {
  const secret = process.env.WHATSAPP_DEMO_APP_SECRET?.trim();
  if (!secret || !signatureHeader?.startsWith("sha256=")) return false;

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");

  const provided = Buffer.from(signatureHeader);
  const target = Buffer.from(expected);

  return provided.length === target.length && crypto.timingSafeEqual(provided, target);
}

function inferRole(messageText) {
  const text = String(messageText || "").toLocaleLowerCase("pt-BR");
  if (
    ["sou filha", "sou filho", "minha mãe", "minha mae", "meu pai", "cuidador", "cuidadora", "familiar"]
      .some((term) => text.includes(term))
  ) {
    return "family";
  }
  return "patient";
}

async function sendWhatsAppText({ to, body }) {
  const token = process.env.WHATSAPP_DEMO_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_DEMO_PHONE_NUMBER_ID?.trim();

  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp demo credentials are not configured");
  }

  const response = await fetch(
    `https://graph.facebook.com/${graphVersion()}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: false, body: String(body || "").slice(0, 3500) },
      }),
      signal: AbortSignal.timeout(12000),
    },
  );

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || `WhatsApp Graph API HTTP ${response.status}`);
  }
  return payload;
}

function extractIncomingMessages(payload) {
  const messages = [];

  for (const entry of payload?.entry || []) {
    for (const change of entry?.changes || []) {
      if (change?.field !== "messages") continue;
      const value = change?.value || {};

      for (const message of value.messages || []) {
        messages.push({
          id: message.id,
          from: message.from,
          type: message.type,
          text: message.type === "text" ? message.text?.body || "" : "",
        });
      }
    }
  }

  return messages;
}

async function processIncomingMessage(message) {
  if (!message?.id || !message?.from) return { ignored: "invalid_message" };
  if (!isAllowedNumber(message.from)) return { ignored: "not_allowlisted" };
  if (!conversationalDatabaseConfigured()) throw new Error("Database is not configured");
  if (await conversationMessageExists(message.id)) return { ignored: "duplicate" };

  const tenant = getConversationalTenant("amanda-fialho");
  const session = await getOrCreateConversationSession({
    tenantKey: tenant.id,
    channel: "whatsapp",
    externalUserKey: externalUserKey(message.from),
    role: inferRole(message.text),
  });

  const incomingText =
    message.type === "text"
      ? message.text.trim()
      : "[A pessoa enviou uma mensagem não textual. Explique com gentileza que esta primeira versão do piloto aceita apenas texto.]";

  await insertConversationMessage({
    sessionId: session.id,
    externalMessageId: message.id,
    role: "user",
    content: incomingText,
    metadata: { type: message.type },
  });

  const history = await loadConversationMessages(session.id, 14);
  const result = await respondConversationally({
    tenant,
    role: inferRole(message.text),
    messages: history,
  });

  await insertConversationMessage({
    sessionId: session.id,
    role: "assistant",
    content: result.reply,
    metadata: {
      mode: result.mode,
      intent: result.intent,
      handoff: Boolean(result.handoff),
    },
  });

  if (result.handoff) {
    await setConversationSessionStatus(session.id, "handoff");
  }

  if (demoMode() === "live") {
    await sendWhatsAppText({ to: message.from, body: result.reply });
  }

  return {
    processed: true,
    mode: demoMode(),
    aiMode: result.mode,
    handoff: Boolean(result.handoff),
  };
}

export async function GET(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe") {
    const expected = process.env.WHATSAPP_DEMO_VERIFY_TOKEN?.trim();
    if (expected && token === expected && challenge) {
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }
    return new Response("Forbidden", { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    service: "proxy-conversational-whatsapp-demo",
    tenant: "amanda-fialho",
    mode: demoMode(),
    aiMode: process.env.WHATSAPP_DEMO_AI_MODE === "live" ? "live" : "preview",
    graphVersion: graphVersion(),
    configured: {
      verifyToken: Boolean(process.env.WHATSAPP_DEMO_VERIFY_TOKEN?.trim()),
      appSecret: Boolean(process.env.WHATSAPP_DEMO_APP_SECRET?.trim()),
      accessToken: Boolean(process.env.WHATSAPP_DEMO_ACCESS_TOKEN?.trim()),
      phoneNumberId: Boolean(process.env.WHATSAPP_DEMO_PHONE_NUMBER_ID?.trim()),
      sessionSecret: Boolean(process.env.WHATSAPP_DEMO_SESSION_SECRET?.trim()),
      database: conversationalDatabaseConfigured(),
      openai: Boolean(process.env.OPENAI_API_KEY?.trim()),
      allowedTesters: normalizedAllowedNumbers().length,
    },
    retentionHours: 24,
  });
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const messages = extractIncomingMessages(payload);
  if (!messages.length) {
    return NextResponse.json({ ok: true, ignored: "no_incoming_messages" });
  }

  try {
    await purgeExpiredConversationDemoData(24);
    const results = [];
    for (const message of messages) {
      results.push(await processIncomingMessage(message));
    }
    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Conversational WhatsApp demo webhook error", error);
    return NextResponse.json({ ok: false, error: "processing_failed" }, { status: 500 });
  }
}
