// Hashes IPs before they touch the DB — we only ever need to compare, never to know the address.
import { createHash } from "crypto";
import { env } from "@/lib/env";

export function hashIp(ip: string) {
  return createHash("sha256").update(`${ip}:${env.BETTER_AUTH_SECRET}`).digest("hex");
}

export function requestIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "0.0.0.0";
}
