import { z } from "zod";

/**
 * @description Zod schema for the returned GitHub repository owner from the "Simple Search" feature.
 */
export const GitHubRepoOwner = z.object({
  login: z.string(),
  id: z.number().int(),
  avatar_url: z.string().url(),
  created_at: z.string().datetime().optional(),
});
export type GitHubRepoOwnerType = z.infer<typeof GitHubRepoOwner>;

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
export type GitHubRepoType = z.infer<typeof GitHubRepo>;

/**
 * @description Zod schema for the returned object from the GitHub API from the "Simple Search" feature.
 */
export const GitHubRepoSearchResult = z.object({
  total_count: z.number().int(),
  incomplete_results: z.boolean(),
  items: GitHubRepo.array(),
});
export type GitHubRepoSearchResultType = z.infer<typeof GitHubRepoSearchResult>;
