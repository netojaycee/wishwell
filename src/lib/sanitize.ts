// Untrusted text from anonymous contributors and owners (see CLAUDE.md guardrails). Every
// piece of it is rendered by React as text, never as HTML, so we strip all markup and then
// decode entities: sanitize-html escapes "&" to "&amp;", and React escapes again on render,
// which used to show "Tom &amp; Jerry" on the board.
import sanitizeHtml from "sanitize-html";

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
};

export function sanitizePlainText(raw: string) {
  const stripped = sanitizeHtml(raw, { allowedTags: [], allowedAttributes: {}, disallowedTagsMode: "discard" });
  return stripped.replace(/&(amp|lt|gt|quot|#39|#x27);/g, (m) => ENTITIES[m] ?? m).trim();
}

// Post bodies are shown as plain text with line breaks preserved (whitespace-pre-line).
export const sanitizePostBody = sanitizePlainText;
