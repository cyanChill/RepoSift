"use server";

import { ENV } from "@/lib/env-server";
import { randInt } from "@/lib/utils";
import type { GitHubRepo } from "@/lib/zod/schema";
import { GitHubRepoSearchResult, SimpleSearchSchema } from "@/lib/zod/schema";

export async function simpleSearch(formData: FormData): Promise<GitHubRepo[]> {
  /* Validate input data */
  const schemaRes = SimpleSearchSchema.safeParse(formData);
  if (!schemaRes.success) {
    const { errors } = schemaRes.error;
    // FIXME: Can alternatively return the errors depending on how we want to
    //        implement this.
    console.log(errors);
    throw new Error("Invalid Inputs");
  }

  const { provider, languages, minStars = 0, maxStars, limit } = schemaRes.data;
  // TODO: Eventually implement Simple Search with GitLab & Bitbucket's
  if (["gitlab", "bitbucket"].includes(provider)) {
    throw new Error(
      `Simple Search currently doesn't support the ${provider} provider option.`
    );
  }

  const LIMIT = limit ?? 100; // Up to 100
  // Create a random "min" value to reduce chances of getting the same result
  const randMin = randInt(minStars, maxStars ?? 2500);
  const starQStr = !maxStars
    ? `stars:>=${randMin}`
    : `stars:${randMin}..${maxStars}`;
  const langQStr =
    !languages || languages.length === 0
      ? ""
      : "+language:" + languages.join("+language:");

  const request_url = `https://api.github.com/search/repositories?q=${starQStr}${langQStr}&per_page=${LIMIT}&sort=stars&order=asc`;
  const res = await fetch(request_url, {
    headers: {
      accept: "application/json",
      authorization: `Basic ${btoa(`${ENV.GITHUB_ID}:${ENV.GITHUB_SECRET}`)}`,
      "user-agent": "repo-sift-server",
    },
  });
  const data: unknown = await res.json();
  const dataRes = GitHubRepoSearchResult.safeParse(data);
  if (!dataRes.success) {
    const { errors } = dataRes.error;
    // FIXME: Can alternatively return the errors depending on how we want to
    //        implement this.
    console.log(errors);
    console.log(data); // See what was returned instead
    throw new Error("Something unexpected happened.");
  }
  const { total_count, items } = dataRes.data;

  console.log("[simpleSearch()] Total Results Found:", total_count);
  console.log("[simpleSearch()] Results:", items);

  return items;
}
