// Single Postgres client + Drizzle instance, shared across server code.
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const isLocal = env.DATABASE_URL.includes("127.0.0.1") || env.DATABASE_URL.includes("localhost");

const client = postgres(env.DATABASE_URL, {
  ssl: isLocal ? false : "require",
  max: isLocal ? 10 : 1, // serverless: one connection per invocation
});

export const db = drizzle(client, { schema });
