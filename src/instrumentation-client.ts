// Client analytics bootstrap (Next 16 `instrumentation-client` convention — runs before the
// app becomes interactive). PostHog initialises only when NEXT_PUBLIC_POSTHOG_KEY is set,
// so local dev and anyone without a key send nothing. Pageviews + the explicit funnel
// events in src/lib/analytics.ts only: no autocapture, no session recording — people post
// grief and family photos here, and we don't need to watch them do it.
import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  try {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: "history_change",
      autocapture: false,
      disable_session_recording: true,
      person_profiles: "identified_only",
    });
  } catch {
    // Analytics must never break the product.
  }
}
