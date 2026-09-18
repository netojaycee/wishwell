"use client";

// A date in the viewer's own timezone and locale. Renders nothing during SSR (the server
// can't know the viewer's timezone), so there's never a hydration mismatch.
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function LocalDate({ value, options }: { value: Date | string; options?: Intl.DateTimeFormatOptions }) {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  if (!isClient) return null;
  return (
    <time dateTime={new Date(value).toISOString()}>
      {new Date(value).toLocaleString(undefined, options ?? { weekday: "long", day: "numeric", month: "long" })}
    </time>
  );
}
