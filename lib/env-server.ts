import "server-only";
import z from "zod";

const serverENVSchema = z.object({
  DATABASE_HOST: z.string().min(1),
  DATABASE_USERNAME: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  SECRET: z.string().min(1),
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
});

export const ENV = serverENVSchema.parse(process.env);
