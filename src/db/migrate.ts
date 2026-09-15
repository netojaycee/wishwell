// Applies pending SQL migrations from src/db/migrations. Run via `pnpm db:migrate`.
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const isLocal = url.includes("127.0.0.1") || url.includes("localhost");

  const client = postgres(url, { ssl: isLocal ? false : "require", max: 1 });
  const db = drizzle(client);

  console.log("Running migrations…");
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migrations complete.");

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
