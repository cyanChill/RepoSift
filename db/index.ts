import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

import schema from "./schema";

// Create the connection
const connection = connect({
  url: process.env["DATABASE_URL"],
});

export const db = drizzle(connection, { schema });
export type DrizzleSchema = typeof schema;
