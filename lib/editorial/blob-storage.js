import { put } from "@vercel/blob";

function extensionFor(format) {
  if (format === "jpeg") return "jpg";
  if (format === "webp") return "webp";
  return "png";
}

function contentTypeFor(format) {
  if (format === "jpeg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  return "image/png";
}

function safeSegment(value) {
  return String(value || "asset")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "asset";
}

export async function storeEditorialImage({
  tenantKey,
  topicSlug,
  assetId,
  bytes,
  outputFormat,
}) {
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  const extension = extensionFor(outputFormat);
  const pathname = [
    "editorial",
    safeSegment(tenantKey),
    safeSegment(topicSlug),
    `${assetId}.${extension}`,
  ].join("/");

  const blob = await put(pathname, bytes, {
    access: "public",
    contentType: contentTypeFor(outputFormat),
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    url: blob.url,
    pathname: blob.pathname || pathname,
    contentType: contentTypeFor(outputFormat),
  };
}
