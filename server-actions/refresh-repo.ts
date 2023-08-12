"use server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { repositories, repoLangs, languages } from "@/db/schema/main";
import type { Language } from "@/db/schema/main";

import { getGitHubRepoData, getGitHubRepoLang } from "./providerSearch";
import type { ErrorObj, SuccessObj } from "@/lib/types";
import { containsSAErr, getZodMsg } from "@/lib/utils/error";
import { toSafeId } from "@/lib/utils/mutate";
import { isNotOneWeekOld } from "@/lib/utils/validation";

const InputSchema = z
  .string({
    required_error: "A repository id is required.",
    invalid_type_error: "A repository id must be a string.",
  })
  .trim()
  .min(1, { message: "A repository id must be non-empty." });

export async function refreshRepository(
  unCleanRepoId: string,
): Promise<ErrorObj | RefreshRepoReturn> {
  /* Validate input data */
  const schemaRes = InputSchema.safeParse(unCleanRepoId);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const repoId = schemaRes.data;

  const repoExist = await db.query.repositories.findFirst({
    where: (fields, { eq }) => eq(fields.id, repoId),
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

  const langs = await getGitHubRepoLang(repository.languages_url);
  if (containsSAErr(langs)) return langs;
  // Update "RepoLangs" on repository relations
  //  1. Delete old "RepoLangs" relation
  //  2. Fetch updated languages & insert into "Languages" table if they don't exist
  //  3. Re-create the relations.
  await db.delete(repoLangs).where(eq(repoLangs.repoId, repoId));
  const updtLangs: Language[] = langs.data.map((lang) => ({
    name: toSafeId(lang),
    display: lang,
  }));
  for (const lang of updtLangs) {
    try {
      await db.insert(languages).values(lang);
    } catch {}
    await db.insert(repoLangs).values({ name: lang.name, repoId });
  }

  // Update "Repository" values
  const updtValues = {
    name: repository.name,
    description: repository.description,
    stars: repository.stargazers_count,
  };
  await db
    .update(repositories)
    .set({
      ...(repository.owner?.login ? { author: repository.owner?.login } : {}),
      ...updtValues,
      lastUpdated: new Date(),
    })
    .where(eq(repositories.id, repoId));

  return { data: null };
}
