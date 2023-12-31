"use server";
import { ENV } from "@/lib/env-server";
import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { randInt } from "@/lib/utils";
import { getZodMsg } from "@/lib/utils/error";
import { GitHubRepoSearchResult, type GitHubRepoType } from "@/lib/zod/schema";
import { sSFilters } from "./schema";

export async function doSimpleSearch(
  formData: GenericObj,
): Promise<ErrorObj | GitHubSearchReturn> {
  /* Validate input data */
  const schemaRes = sSFilters.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };

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

  return { error: "Invalid provider was provided." };
}

type SearchProps = {
  minStars: number;
  maxStars: number | undefined;
  languages: string[] | undefined;
  limit: number;
};

type GitHubSearchReturn = Promise<
  ErrorObj | SuccessObj<{ provider: "github"; items: GitHubRepoType[] }>
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
      return { error: "Received data of an unexpected form from GitHub." };
    }

    return { data: { provider: "github", items: dataParsed.data.items } };
  } catch (err) {
    return { error: "Something unexpected happened." };
  }
}
