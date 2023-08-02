import { ENV } from "@/lib/env-server";
import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { GitHubRepo, type GitHubRepoType } from "@/lib/zod/schema";

type getGitHubRepoDataProps =
  | { type: "id"; repoId: string }
  | { type: "new"; author: string; repoName: string };

/**
 * @description Returns either an error or a GitHub repository.
 * @param props.type Determines the search type (either "id" or "new").
 * @param props.repoId Available if props.type = "id".
 * @param props.author Available if props.type = "new".
 * @param props.repoName Available if props.type = "new".
 * @returns An object containing an error or an object containing the specified repository.
 */
export async function getGitHubRepoData(
  props: getGitHubRepoDataProps
): Promise<ErrorObj | SuccessObj<GitHubRepoType>> {
  const searchType = props.type;
  const searchUrl =
    searchType === "new"
      ? `https://api.github.com/repos/${props.author}/${props.repoName}`
      : `https://api.github.com/repositories/${props.repoId}`;

  try {
    const res = await fetch(searchUrl, {
      headers: {
        accept: "application/json",
        authorization: `Basic ${btoa(`${ENV.GITHUB_ID}:${ENV.GITHUB_SECRET}`)}`,
        "user-agent": "repo-sift-server",
      },
    });
    const data: unknown = await res.json();
    const dataParsed = GitHubRepo.safeParse(data);
    if (!dataParsed.success) {
      console.log(data); // See what was returned instead
      console.log(dataParsed.error.errors); // For debugging purposes
      return { error: "Received data of an unexpected form from GitHub." };
    }
    return { data: dataParsed.data };
  } catch (err) {
    return { error: "Something unexpected happened." };
  }
}

/**
 * @description Returns either an error or an array of languages.
 * @param url A string to a repositorie's languages.
 * @returns An object containing an error or an object containing an array of languages.
 */
export async function getGitHubRepoLang(
  url: string
): Promise<ErrorObj | SuccessObj<string[]>> {
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        authorization: `Basic ${btoa(`${ENV.GITHUB_ID}:${ENV.GITHUB_SECRET}`)}`,
        "user-agent": "repo-sift-server",
      },
    });
    const data = (await res.json()) as GenericObj;
    if (data?.message) throw new Error("Repository doesn't exist.");
    return { data: Object.keys(data) };
  } catch (err) {
    return { error: "Something unexpected happened." };
  }
}
