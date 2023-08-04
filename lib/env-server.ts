import "server-only";
import z from "zod";

const serverENVSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_URL: z.string().url().min(1),
  SECRET: z.string().min(1),
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
});

export const ENV = serverENVSchema.parse(process.env);
