import { cache } from "react";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

import { db } from "@/db";
import { repoLabels, repoLangs, repositories } from "@/db/schema/main";
import type { Repository } from "@/db/schema/main";

import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { getZodMsg } from "@/lib/utils/error";
import { IndexedSearchSchema } from "@/lib/zod/schema";

export const revalidate = 900; // Revalidate data at most every 15 minutes

/**
 * @description Get repositories from database based on filters w/ pagination.
 * @returns An object.
 */
export const getIndexedRepos = cache(async function (
  formData: GenericObj
): Promise<
  ErrorObj | SuccessObj<Omit<Repository, "_primaryLabel" | "userId">[]>
> {
  /* Validate input data */
  const schemaRes = IndexedSearchSchema.safeParse(formData);
  if (!schemaRes.success) {
    console.log(schemaRes.error.errors); // For debugging purposes
    return { error: getZodMsg(schemaRes.error) };
  }
  const { providers, languages, primary_label, labels } = schemaRes.data;
  const { minStars, maxStars, page = 1 } = schemaRes.data;

  const LIMIT = 15; // Maximum results returned
  const conditions: SQL[] = [];
  let filteredIds = new Set<string>();

  if (providers && providers.length > 0) {
    conditions.push(inArray(repositories.type, providers));
  }
  if (minStars) {
    conditions.push(gte(repositories.stars, minStars));
  }
  if (maxStars ?? maxStars === 0) {
    conditions.push(lte(repositories.stars, maxStars));
  }
  if (primary_label) {
    conditions.push(eq(repositories._primaryLabel, primary_label));
  }
  if (languages && languages.length > 0) {
    /*
      1. Get all "RepoLang" entries that's in our "languages" constraint.
        -> Group them by "repoId", with a "numMatches" containing the
           number of matched "RepoLang" entries for a given repository.
      2. Possible repositories that match our filters will have "numMatches"
         equal to the number of values in the "languages" constraint.
    */
    const matchedRepos = (
      await db
        .select({
          numMatches: sql<number>`count(${repoLangs.repoId})`,
          repoId: repoLangs.repoId,
        })
        .from(repoLangs)
        .where(inArray(repoLangs.name, languages))
        .groupBy(({ repoId }) => repoId)
    )
      .filter((entry) => +entry.numMatches === languages.length)
      .map((entry) => entry.repoId);
    filteredIds = new Set(matchedRepos);

    // No repositories found with all languages required.
    if (filteredIds.size === 0) return { data: [] };
  }
  if (labels && labels.length > 0) {
    /*
      1. If "filteredIds.size === 0", then we don't have a "languages" constraint.
      2. If we do have a "languages" constraint, "filteredIds.size" is
         guaranteed to be >0 and we'll find "RepoLabel" entries based off
         the repository ids in "filteredIds".
    */
    const _cond =
      filteredIds.size > 0
        ? and(
            inArray(repoLabels.repoId, [...filteredIds]),
            inArray(repoLabels.name, labels)
          )
        : inArray(repoLabels.name, labels);
    // Do the same thing as the "languages" constraint.
    const matchedRepos = (
      await db
        .select({
          numMatches: sql<number>`count(${repoLabels.repoId})`,
          repoId: repoLabels.repoId,
        })
        .from(repoLabels)
        .where(_cond)
        .groupBy(({ repoId }) => repoId)
    )
      .filter((entry) => +entry.numMatches === labels.length)
      .map((entry) => entry.repoId);
    filteredIds = new Set(matchedRepos);

    // No repositories found with all labels required.
    if (filteredIds.size === 0) return { data: [] };
  }

  // Reduce the number of possible repositories that can be searched.
  if (filteredIds.size > 0) {
    conditions.push(inArray(repositories.id, [...filteredIds]));
  }

  const results = await db.query.repositories.findMany({
    where: and(...conditions),
    columns: { _primaryLabel: false, userId: false },
    with: {
      labels: { with: { label: true } },
      languages: { with: { language: true } },
      primaryLabel: true,
      user: true,
    },
    limit: LIMIT,
    offset: (page <= 0 ? 0 : page - 1) * LIMIT,
  });

  return { data: results };
});
