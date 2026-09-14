// Post bodies are untrusted input from anonymous contributors — plain text + a small
// set of formatting tags only, everything else stripped (see CLAUDE.md guardrails).
import sanitizeHtml from "sanitize-html";

export function sanitizePostBody(raw: string) {
  return sanitizeHtml(raw, {
    allowedTags: ["b", "i", "em", "strong", "br", "p"],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  }).trim();
}

export function sanitizePlainText(raw: string) {
  return sanitizeHtml(raw, { allowedTags: [], allowedAttributes: {} }).trim();
}
