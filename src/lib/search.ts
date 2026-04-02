export type HighlightSegment = {
  text: string;
  highlighted: boolean;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getSearchTokens(query: string) {
  return query
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function highlightSegments(text: string, query: string): HighlightSegment[] {
  const tokens = getSearchTokens(query);

  if (!tokens.length) {
    return [
      {
        text,
        highlighted: false
      }
    ];
  }

  const matcher = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(matcher).filter(Boolean);

  return parts.map((part) => ({
    text: part,
    highlighted: tokens.some((token) => token.toLowerCase() === part.toLowerCase())
  }));
}

export function buildExcerpt(text: string, query: string, maxLength = 140) {
  const normalized = text.trim();

  if (!normalized) {
    return "";
  }

  const tokens = getSearchTokens(query);

  if (!tokens.length || normalized.length <= maxLength) {
    return normalized.length <= maxLength
      ? normalized
      : `${normalized.slice(0, maxLength).trimEnd()}...`;
  }

  const lowerText = normalized.toLowerCase();
  const firstMatchIndex = tokens
    .map((token) => lowerText.indexOf(token.toLowerCase()))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];

  if (firstMatchIndex === undefined) {
    return `${normalized.slice(0, maxLength).trimEnd()}...`;
  }

  const start = Math.max(0, firstMatchIndex - Math.floor(maxLength * 0.35));
  const end = Math.min(normalized.length, start + maxLength);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < normalized.length ? "..." : "";

  return `${prefix}${normalized.slice(start, end).trim()}${suffix}`;
}
