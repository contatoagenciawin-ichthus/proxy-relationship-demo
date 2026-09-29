import { NextResponse } from "next/server";

import { getConversationalTenant } from "../../../../config/conversational-tenants";
import {
  normalizeConversationMessages,
  respondConversationally,
} from "../../../../lib/conversational/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  const mode = process.env.CONVERSATIONAL_AI_MODE === "live" ? "live" : "preview";

  return NextResponse.json({
    mode,
    provider: "openai",
    model: process.env.CONVERSATIONAL_AI_MODEL?.trim() || "gpt-5.6-luna",
    liveConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()) && mode === "live",
    persistence: false,
    channel: "web-demo",
  });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const tenant = getConversationalTenant(payload?.tenant);
    const role = ["patient", "family", "secretary"].includes(payload?.role)
      ? payload.role
      : "patient";
    const messages = normalizeConversationMessages(payload?.messages);

    if (!messages.length || messages.at(-1)?.role !== "user") {
      return NextResponse.json(
        { ok: false, message: "Envie uma mensagem para continuar a demonstração." },
        { status: 400 },
      );
    }

    const result = await respondConversationally({
      tenant,
      role,
      messages,
      channel: "web",
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Não consegui concluir esta resposta agora. Na operação real, esse tipo de falha deve transferir a conversa para uma pessoa da equipe.",
      },
      { status: 500 },
    );
  }
}
