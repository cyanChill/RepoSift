import { z } from "zod";

import { OPT_NONNEG_INT, PROVIDERS_ENUM } from "./types";

export const SimpleSearchSchema = z
  .object({
    provider: PROVIDERS_ENUM,
    languages: z.coerce
      .string()
      .transform((val, ctx) => {
        if (!val) return;

        let parsed: unknown;
        try {
          parsed = JSON.parse(val);
          if (!Array.isArray(parsed)) throw Error();
        } catch {
          ctx.addIssue({
            code: "invalid_type",
            path: ["languages"],
            expected: "array",
            received: "string",
            message: "Languages is not an array.",
          });
          return z.NEVER;
        }

        const safeArr = parsed.map((arrVal) =>
          encodeURIComponent(String(arrVal).trim())
        );
        if (safeArr.length > 5) {
          ctx.addIssue({
            code: "too_big",
            path: ["languages"],
            maximum: 5,
            type: "array",
            inclusive: true,
            exact: false,
            message: "There can be at most 5 languages.",
          });
          return z.NEVER;
        }

        return safeArr;
      })
      .optional(),
    minStars: OPT_NONNEG_INT,
    maxStars: OPT_NONNEG_INT,
    limit: z.number().int().min(15).max(100).optional(),
  })
  .refine(
    ({ minStars, maxStars }) => {
      if (typeof minStars === "number" && typeof maxStars === "number") {
        return maxStars > minStars;
      }
      return true;
    },
    { message: "⚠️ Max stars must be greater than min stars." }
  );
export type SimpleSearchSchema = z.infer<typeof SimpleSearchSchema>;

export const GitHubRepoOwner = z.object({
  login: z.string(),
  id: z.number().int(),
  avatar_url: z.string().url(),
  created_at: z.string().datetime().optional(),
});
export type GitHubRepoOwner = z.infer<typeof GitHubRepoOwner>;

export const GitHubRepo = z.object({
  id: z.number().int(),
  name: z.string(),
  full_name: z.string(),
  owner: GitHubRepoOwner.nullable(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  languages_url: z.string().url(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  stargazers_count: z.number().int(),
  language: z.string().nullable(),
});
export type GitHubRepo = z.infer<typeof GitHubRepo>;

export const GitHubRepoSearchResult = z.object({
  total_count: z.number().int(),
  incomplete_results: z.boolean(),
  items: GitHubRepo.array(),
});
export type GitHubRepoSearchResult = z.infer<typeof GitHubRepoSearchResult>;

export const LabelFormSchema = z.object({
  label: z
    .string({
      required_error: "A label is required.",
      invalid_type_error: "A label must be a string.",
    })
    .trim()
    .min(3, { message: "A label must be at least 3 characters long." })
    .max(25, { message: "A label must be at most 25 characters long." })
    .transform((val, ctx) => {
      // Validate Regex
      const rgx = /[A-Za-z.\-\s]{3,25}/;
      if (!val.match(rgx)) {
        ctx.addIssue({
          code: "custom",
          path: ["label"],
          message:
            "A label must contain only letters, periods, hyphens, and spaces.",
        });
        return z.NEVER;
      }

      return val;
    }),
});
export type LabelFormSchema = z.infer<typeof LabelFormSchema>;
