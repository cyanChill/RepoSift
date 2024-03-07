import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

import schema from "./schema";

// Create the connection
const connection = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(connection, { schema });
export type DrizzleSchema = typeof schema;
