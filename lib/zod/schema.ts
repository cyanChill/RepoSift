import { z } from "zod";

import { OPT_NONNEG_INT, PROVIDERS_ENUM } from "./types";

export const SimpleSearchSchema = z
  .object({
    provider: PROVIDERS_ENUM,
    languages: z
      .string()
      .trim()
      .transform((val) => encodeURIComponent(val))
      .array()
      .max(5, { message: "⚠️ At most 5 languages." })
      .optional(),
    minStars: OPT_NONNEG_INT,
    maxStars: OPT_NONNEG_INT,
    limit: z.number().int().min(15).max(100).optional(),
  })
  .strict()
  .refine(
    ({ minStars, maxStars }) => {
      if (minStars && maxStars) return maxStars > minStars;
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
