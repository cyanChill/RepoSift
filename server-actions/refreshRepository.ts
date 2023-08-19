"use server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { repositories, repoLangs, languages } from "@/db/schema/main";

import { getGitHubRepoData, getGitHubRepoLang } from "./providerSearch";
import type { ErrorObj, SuccessObj } from "@/lib/types";
import { providersVal } from "@/lib/utils/constants";
import { containsSAErr } from "@/lib/utils/error";
import { isNotOneWeekOld } from "@/lib/utils/validation";
import type { AuthProviders } from "@/lib/zod/utils";

export async function refreshRepository(
  repoId: string,
  repoType: AuthProviders,
): Promise<ErrorObj | RefreshRepoReturn> {
  if (!repoId.trim()) {
    return { error: "You must provide a valid repository id." };
  }
  if (!providersVal.includes(repoType)) {
    return { error: "Invalid repository type." };
  }

  const repoExist = await db.query.repositories.findFirst({
    where: (fields, { eq }) => eq(fields._pk, `${repoId}|${repoType}`),
  });
  if (!repoExist) {
    return { error: "The repository you're trying to refresh doesn't exist." };
  }
  // Prevent refresh if repository has been refreshed recently
  if (isNotOneWeekOld(repoExist.lastUpdated)) {
    return { error: "This repository has been refreshed recently." };
  }

  if (repoExist.type === "github") return await refreshGitHub(repoId);
  const UNIMPLEMENTED_ERROR = {
    error: `Repositories from the ${repoExist.type} provider option can't be refreshed currently.`,
  };
  if (repoExist.type === "gitlab") return UNIMPLEMENTED_ERROR;
  if (repoExist.type === "bitbucket") return UNIMPLEMENTED_ERROR;

  return { error: "Repository has an invalid provider." };
}

type RefreshRepoReturn = Promise<ErrorObj | SuccessObj<null>>;

async function refreshGitHub(repoId: string): RefreshRepoReturn {
  const searchResult = await getGitHubRepoData({ type: "id", repoId });
  if (containsSAErr(searchResult)) return searchResult;
  const { data: repository } = searchResult;

  const _repoPK = `${repoId}|github`;

  const updtLangs = await getGitHubRepoLang(repository.languages_url);
  if (containsSAErr(updtLangs)) return updtLangs;

  try {
    await db.transaction(async (tx) => {
      // Delete old language relations
      await tx.delete(repoLangs).where(eq(repoLangs.repoPK, _repoPK));
      // Insert new languages if any
      for (const lang of updtLangs.data) {
        try {
          await tx.insert(languages).values(lang);
        } catch {}
      }
      // Insert new language relations
      const newLangRels = updtLangs.data.map((lang) => ({
        name: lang.name,
        repoPK: _repoPK,
      }));
      await tx.insert(repoLangs).values(newLangRels);

      // Update "Repository" values
      const updtValues = {
        name: repository.name,
        description: repository.description,
        stars: repository.stargazers_count,
      };
      await tx
        .update(repositories)
        .set({
          ...(repository.owner?.login
            ? { author: repository.owner?.login }
            : {}),
          ...updtValues,
          lastUpdated: new Date(),
        })
        .where(eq(repositories._pk, _repoPK));
    });

    return { data: null };
  } catch (err) {
    return { error: "Failed to update repository." };
  }
}
