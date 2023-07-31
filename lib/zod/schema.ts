import { z } from "zod";

import {
  OPT_NONNEG_INT,
  PROVIDERS_ENUM,
  arrayTransform,
  regexTest,
} from "./utils";
import { LIMITS, PATTERNS } from "../utils";

/**
 * @description Zod schema for "Simple Search" feature.
 */
export const SimpleSearchSchema = z
  .object({
    provider: PROVIDERS_ENUM,
    languages: z.coerce
      .string()
      .transform(arrayTransform("Languages", 5))
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

/**
 * @description Zod schema for the returned GitHub repository owner from the "Simple Search" feature.
 */
export const GitHubRepoOwner = z.object({
  login: z.string(),
  id: z.number().int(),
  avatar_url: z.string().url(),
  created_at: z.string().datetime().optional(),
});
export type GitHubRepoOwner = z.infer<typeof GitHubRepoOwner>;

/**
 * @description Zod schema for the returned GitHub repository from the "Simple Search" feature.
 */
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

/**
 * @description Zod schema for the returned object from the GitHub API from the "Simple Search" feature.
 */
export const GitHubRepoSearchResult = z.object({
  total_count: z.number().int(),
  incomplete_results: z.boolean(),
  items: GitHubRepo.array(),
});
export type GitHubRepoSearchResult = z.infer<typeof GitHubRepoSearchResult>;

/**
 * @description Zod schema for "Suggest Label" feature.
 */
export const LabelFormSchema = z.object({
  label: z
    .string({
      required_error: "A label is required.",
      invalid_type_error: "A label must be a string.",
    })
    .trim()
    .min(3, { message: "A label must be at least 3 characters long." })
    .max(LIMITS.LABEL, {
      message: `A label must be at most ${LIMITS.LABEL} characters long.`,
    })
    .transform(
      regexTest({
        regexBase: PATTERNS.LABEL,
        label: "label",
        errorMsg:
          "A label must contain only letters, periods, hyphens, and spaces.",
      })
    ),
});
export type LabelFormSchema = z.infer<typeof LabelFormSchema>;

/**
 * @description Zod schema for "Index repository" feature.
 */
export const RepoFormSchema = z.object({
  provider: PROVIDERS_ENUM,
  author: z
    .string()
    .trim()
    .min(1, {
      message: "A repository author must be at least 1 characters long.",
    })
    .max(LIMITS.GITHUB_USERNAME, {
      message: `A repository author must be at most ${LIMITS.GITHUB_USERNAME} characters long.`,
    })
    .transform(
      regexTest({
        regexBase: PATTERNS.GITHUB_USERNAME,
        label: "author",
        errorMsg:
          "A repository author can contain only alphanumeric characters and hyphens.",
      })
    ),
  name: z
    .string()
    .trim()
    .min(1, {
      message: "A repository name must be at least 1 characters long.",
    })
    .max(LIMITS.GITHUB_REPONAME, {
      message: `A repository name must be at most ${LIMITS.GITHUB_REPONAME} characters long.`,
    })
    .transform(
      regexTest({
        regexBase: PATTERNS.GITHUB_REPONAME,
        label: "name",
        errorMsg:
          "A repository name can contain only alphanumeric characters, periods, underscores, and hyphens.",
      })
    ),
  primary_label: z
    .string()
    .trim()
    .min(1, { message: "A primary label must be selected." }),
  labels: z.coerce.string().transform(arrayTransform("Labels", 5)).optional(),
});
export type RepoFormSchema = z.infer<typeof LabelFormSchema>;
