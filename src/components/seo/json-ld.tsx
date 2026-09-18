// Structured data <script>. Always use this instead of a raw JSON.stringify: board titles
// and names are user-supplied, and an unescaped "</script>" in one would be stored XSS on
// a public board. Escaping "<" as < is the Next.js-recommended fix.
// suppressHydrationWarning: some browser extensions rewrite script `type` attributes before
// hydration; the server output is correct, so that attribute-only mismatch is just noise.
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
