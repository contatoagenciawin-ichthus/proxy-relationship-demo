import { NextResponse } from "next/server";
import { sendTransactionalEmail } from "../../../../lib/email/brevo";
import { buildTexfieldDemoEmail } from "../../../../lib/email/demo-template";

export const dynamic = "force-dynamic";

function getMode() {
  return process.env.EMAIL_DELIVERY_MODE?.trim().toLowerCase() === "live"
    ? "live"
    : "preview";
}

function getProvider() {
  return process.env.EMAIL_PROVIDER?.trim().toLowerCase() || "brevo";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function allowedRecipients() {
  return new Set(
    (process.env.DEMO_ALLOWED_RECIPIENTS || "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function liveConfigState() {
  const provider = getProvider();

  if (provider !== "brevo") {
    return {
      configured: false,
      reason: "Provider de e-mail não suportado neste ambiente.",
    };
  }

  const required = [
    "BREVO_API_KEY",
    "BREVO_SENDER_NAME",
    "BREVO_SENDER_EMAIL",
  ];

  const missing = required.filter(
    (key) => !process.env[key]?.trim(),
  );

  if (missing.length) {
    return {
      configured: false,
      reason: "Credenciais do remetente ainda não foram configuradas.",
    };
  }

  return { configured: true, reason: null };
}

export async function GET() {
  const mode = getMode();
  const state = liveConfigState();

  return NextResponse.json({
    mode,
    provider: getProvider(),
    liveConfigured: state.configured,
    safety: "allowlist",
  });
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Solicitação inválida." },
      { status: 400 },
    );
  }

  const recipient =
    typeof payload?.recipient === "string"
      ? payload.recipient.trim().toLowerCase()
      : "";

  if (!isValidEmail(recipient)) {
    return NextResponse.json(
      { ok: false, message: "Informe um e-mail válido." },
      { status: 400 },
    );
  }

  const mode = getMode();
  const campaign = buildTexfieldDemoEmail();

  if (mode === "preview") {
    return NextResponse.json({
      ok: true,
      mode,
      delivered: false,
      recipient,
      subject: campaign.subject,
      message:
        "Fluxo validado em modo preview. Nenhum e-mail foi enviado.",
      messageId: `preview-${Date.now()}`,
    });
  }

  const allowlist = allowedRecipients();

  if (!allowlist.has(recipient)) {
    return NextResponse.json(
      {
        ok: false,
        mode,
        delivered: false,
        message:
          "Este endereço não está autorizado para envios da demonstração.",
      },
      { status: 403 },
    );
  }

  const state = liveConfigState();

  if (!state.configured) {
    return NextResponse.json(
      {
        ok: false,
        mode,
        delivered: false,
        message: state.reason,
      },
      { status: 503 },
    );
  }

  try {
    const provider = getProvider();

    if (provider !== "brevo") {
      throw new Error("Provider de e-mail não suportado.");
    }

    const result = await sendTransactionalEmail({
      apiKey: process.env.BREVO_API_KEY.trim(),
      sender: {
        name: process.env.BREVO_SENDER_NAME.trim(),
        email: process.env.BREVO_SENDER_EMAIL.trim(),
      },
      replyTo: process.env.BREVO_REPLY_TO?.trim() || undefined,
      recipient,
      subject: campaign.subject,
      htmlContent: campaign.htmlContent,
      textContent: campaign.textContent,
    });

    return NextResponse.json({
      ok: true,
      mode,
      delivered: true,
      recipient,
      subject: campaign.subject,
      message: "E-mail de demonstração enviado.",
      messageId: result.messageId,
      provider: result.provider,
    });
  } catch (error) {
    console.error("Demo email route failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        ok: false,
        mode,
        delivered: false,
        message:
          "Não foi possível enviar a demonstração agora.",
      },
      { status: 502 },
    );
  }
}
