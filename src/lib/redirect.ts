// Validates a post-sign-in `redirectTo` target: same-site paths only ("/dashboard/b/x"),
// never "//evil.com" or "https://…", so the param can't be used as an open redirect.
export function safeRedirect(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}
