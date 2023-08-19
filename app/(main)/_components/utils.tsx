import { FaGithub, FaGitlab, FaBitbucket } from "react-icons/fa6";
import type { AuthProviders } from "@/lib/zod/utils";

export function getProviderIcon(provider: AuthProviders) {
  if (provider === "github") {
    return <FaGithub className="shrink-0" />;
  } else if (provider === "gitlab") {
    return <FaGitlab className="shrink-0" />;
  } else if (provider === "bitbucket") {
    return <FaBitbucket className="shrink-0" />;
  }
}

export function getRepoLink(
  provider: AuthProviders,
  author: string,
  repoName: string,
) {
  if (provider === "github") {
    return `https://www.github.com/${author}/${repoName}`;
  }
  // console.log(`Repository link for ${provider} has not been implemented.`);
  return "#";
}

export function getAccountLink(provider: AuthProviders, author: string) {
  if (provider === "github") return `https://www.github.com/${author}`;
  throw new Error(`Account link for ${provider} has not been implemented.`);
}
