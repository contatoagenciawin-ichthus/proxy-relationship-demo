const OPENAI_IMAGE_ENDPOINT = "https://api.openai.com/v1/images/generations";

function timeoutSignal(milliseconds) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), milliseconds);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  };
}

export async function generateEditorialImage({ prompt }) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model =
    process.env.OPENAI_IMAGE_MODEL?.trim() ||
    "gpt-image-2.5-flare";
  const size =
    process.env.OPENAI_IMAGE_SIZE?.trim() ||
    "1536x1024";
  const quality =
    process.env.OPENAI_IMAGE_QUALITY?.trim() ||
    "low";
  const outputFormat =
    process.env.OPENAI_IMAGE_FORMAT?.trim() ||
    "jpeg";
  const outputCompression = Number.parseInt(
    process.env.OPENAI_IMAGE_COMPRESSION || "84",
    10,
  );

  const timeout = timeoutSignal(55000);

  try {
    const response = await fetch(OPENAI_IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        size,
        quality,
        output_format: outputFormat,
        ...(outputFormat === "jpeg" || outputFormat === "webp"
          ? {
              output_compression: Number.isFinite(outputCompression)
                ? Math.min(100, Math.max(0, outputCompression))
                : 84,
            }
          : {}),
        n: 1,
      }),
      signal: timeout.signal,
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok) {
      const message =
        payload?.error?.message ||
        "OpenAI image generation request failed.";
      throw new Error(message);
    }

    const base64 = payload?.data?.[0]?.b64_json;

    if (!base64) {
      throw new Error("OpenAI returned no image data.");
    }

    return {
      bytes: Buffer.from(base64, "base64"),
      model,
      size,
      quality,
      outputFormat,
    };
  } finally {
    timeout.clear();
  }
}
