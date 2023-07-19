import { z } from "zod";

export const PROVIDERS_ENUM = z.enum(["github", "gitlab", "bitbucket"]);
export type PROVIDERS_ENUM = z.infer<typeof PROVIDERS_ENUM>;

export const OPT_NONNEG_INT = z
  .number()
  .int()
  .min(0, { message: "⚠️ Must be a non-negative integer." })
  .optional();
