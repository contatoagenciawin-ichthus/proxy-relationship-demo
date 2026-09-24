const BREVO_API_BASE_URL = "https://api.brevo.com/v3";

async function readError(response) {
  try {
    const payload = await response.json();
    return typeof payload?.message === "string"
      ? payload.message
      : "A Brevo recusou o envio.";
  } catch {
    return "A Brevo recusou o envio.";
  }
}

export async function sendTransactionalEmail({
  apiKey,
  sender,
  replyTo,
  recipient,
  subject,
  htmlContent,
  textContent,
}) {
  const response = await fetch(`${BREVO_API_BASE_URL}/smtp/email`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender,
      to: [{ email: recipient }],
      subject,
      htmlContent,
      textContent,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readError(response);
    console.error("Demo email delivery failed", {
      provider: "brevo",
      status: response.status,
      message,
    });
    throw new Error(message);
  }

  const payload = await response.json();

  return {
    provider: "brevo",
    messageId:
      typeof payload?.messageId === "string"
        ? payload.messageId
        : null,
  };
}
