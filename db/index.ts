import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

import schema from "./schema";

// Create the connection
const connection = new Client({
  url: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema });
export type DrizzleSchema = typeof schema;
