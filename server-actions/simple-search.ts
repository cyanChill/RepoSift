"use server";

import { ENV } from "@/lib/env-server";
import type { GenericObj } from "@/lib/types";
import { randInt } from "@/lib/utils";
import type { GitHubRepo } from "@/lib/zod/schema";
import { GitHubRepoSearchResult, SimpleSearchSchema } from "@/lib/zod/schema";
import type { AuthProviders } from "@/lib/zod/types";

export async function simpleSearch(
  formData: GenericObj
): Promise<{ error: string } | GitHubSearchReturn | undefined> {
  /* Validate input data */
  const schemaRes = SimpleSearchSchema.safeParse(formData);
  if (!schemaRes.success) {
    console.log(schemaRes.error.errors); // For debugging purposes
    return { error: "Invalid inputs." };
  }

  const { provider, languages, maxStars } = schemaRes.data;
  let { minStars, limit } = schemaRes.data;
  // Create a random "min" value to reduce chances of getting the same result
  minStars = randInt(minStars ?? 0, maxStars ?? 2500);
  limit = limit ?? 100; // Up to 100

  const searchProps = { minStars, maxStars, languages, limit };
  if (provider === "github") return await GitHubSearch(searchProps);
  // TODO: Eventually implement Simple Search with GitLab & Bitbucket's
  const UNIMPLEMENTED_ERROR = {
    error: `Simple Search currently doesn't support the ${provider} provider option.`,
  };
  if (provider === "gitlab") return UNIMPLEMENTED_ERROR;
  if (provider === "bitbucket") return UNIMPLEMENTED_ERROR;
}

type SearchProps = {
  minStars: number;
  maxStars: number | undefined;
  languages: string[] | undefined;
  limit: number;
};

type GitHubSearchReturn = Promise<
  | { error: null; provider: AuthProviders; items: GitHubRepo[] }
  | { error: string }
>;

async function GitHubSearch({
  languages,
  minStars,
  maxStars,
  limit,
}: SearchProps): GitHubSearchReturn {
  const starQStr = !maxStars
    ? `stars:>=${minStars}`
    : `stars:${minStars}..${maxStars}`;
  const langQStr =
    !languages || languages.length === 0
      ? ""
      : "+language:" + languages.join("+language:");

  const request_url = `https://api.github.com/search/repositories?q=${starQStr}${langQStr}&per_page=${limit}&sort=stars&order=asc`;
  try {
    const res = await fetch(request_url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
        authorization: `Basic ${btoa(`${ENV.GITHUB_ID}:${ENV.GITHUB_SECRET}`)}`,
        "user-agent": "repo-sift-server",
      },
    });
    const data: unknown = await res.json();
    const dataParsed = GitHubRepoSearchResult.safeParse(data);
    if (!dataParsed.success) {
      console.log(data); // See what was returned instead
      console.log(dataParsed.error.errors); // For debugging purposes
      return { error: "Something unexpected happened." };
    }

    return { error: null, provider: "github", items: dataParsed.data.items };
  } catch (err) {
    return { error: "Something unexpected happened." };
  }
}
