// Funnel instrumentation (GROWTH.md §6: land → start create → publish board → invites
// sent → first contributor post → 5+ posts → contributor becomes owner). One tiny wrapper
// so call sites don't care which provider is configured: PostHog when
// NEXT_PUBLIC_POSTHOG_KEY is set (initialised in src/instrumentation-client.ts), otherwise
// a no-op. Page views come from Vercel Analytics in the root layout. Never send message
// text, names, emails or board slugs (slugs contain recipients' names) — only coarse,
// non-identifying properties like occasion keys.
import posthog from "posthog-js";

export type FunnelEvent =
  | "create_started"
  | "board_created"
  | "board_link_shared"
  | "invite_sent"
  | "post_created"
  | "create_cta_from_post"
  | "owner_signed_up";

export function track(event: FunnelEvent, props?: Record<string, string | number | boolean | undefined>) {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    posthog.capture(event, props);
  } catch {
    // Analytics must never break the product.
  }
}
