import { defineConfig } from "drizzle-kit";
import "dotenv/config";

/*
  Issue with using this config with Next.js (can't find ENV variables)
    - https://github.com/drizzle-team/drizzle-orm/issues/654#issuecomment-1586378907
*/
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/*",
  out: "./db/migrations-folder",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
