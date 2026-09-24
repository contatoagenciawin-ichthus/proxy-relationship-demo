const DIRECTIONS = {
  "industrial-photo": {
    label: "Fotografia industrial",
    instruction:
      "photorealistic industrial editorial photography, real textile machinery in operation, sophisticated technical atmosphere, controlled industrial light, strong depth and scale, no people in the foreground",
  },
  "technical-grid": {
    label: "Diagrama técnico",
    instruction:
      "premium technical industrial visualization, engineering grid, process flow, machine modules, restrained data overlays, dark technical palette, clean and precise composition",
  },
  "market-editorial": {
    label: "Editorial de mercado",
    instruction:
      "executive editorial image for the textile industry, machinery and market context, sophisticated report-cover composition, industrial realism, restrained visual data cues",
  },
};

function clean(value, maxLength = 600) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function normalizeVisualDirection(value) {
  return Object.hasOwn(DIRECTIONS, value) ? value : "industrial-photo";
}

export function buildEditorialImagePrompt({
  topicTitle,
  topicSummary,
  articleTitle,
  visualDirection,
}) {
  const direction = normalizeVisualDirection(visualDirection);
  const directionConfig = DIRECTIONS[direction];

  const topic = clean(topicTitle, 180);
  const summary = clean(topicSummary, 600);
  const article = clean(articleTitle, 220);

  return [
    "Create a high-quality visual asset for a B2B relationship communication from Texfield, a company connected to textile machinery, parts, technology and industrial support.",
    `Editorial topic: "${topic}".`,
    summary ? `Context: ${summary}.` : "",
    article ? `Article angle: "${article}".` : "",
    `Visual direction: ${directionConfig.instruction}.`,
    "The image must feel credible to senior textile-industry executives and operators, not like a generic startup illustration.",
    "Prioritize textile machinery, mechanical detail, production process, engineering logic and industrial context.",
    "Do not render logos, brand marks, UI screenshots, infographics, captions, headlines or readable text inside the image.",
    "Leave useful negative space so the asset can be cropped for email, WhatsApp and LinkedIn.",
    "Avoid futuristic neon aesthetics, humanoid robots, generic AI symbols, floating holograms and exaggerated science-fiction imagery.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function getVisualDirectionLabel(value) {
  return DIRECTIONS[normalizeVisualDirection(value)].label;
}
