import { mkdir, writeFile } from "node:fs/promises";

const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
const uuid = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
if (!databaseId || !uuid.test(databaseId)) {
  throw new Error("Set CLOUDFLARE_D1_DATABASE_ID to the UUID of the westchestertech-interests D1 database.");
}

const config = {
  name: "westchestertech",
  main: "server/index.js",
  compatibility_date: "2026-11-18",
  workers_dev: true,
  d1_databases: [{
    binding: "DB",
    database_name: "westchestertech-interests",
    database_id: databaseId,
    migrations_dir: "../drizzle"
  }]
};

const output = new URL("./dist/", import.meta.url);
await mkdir(output, { recursive: true });
await writeFile(new URL("wrangler.json", output), JSON.stringify(config, null, 2) + "\n");
