import { cache } from "react";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

import { db } from "@/db";
import { repoLabels, repoLangs, repositories } from "@/db/schema/main";

import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { getZodMsg } from "@/lib/utils/error";
import { iSFilters } from "../schema";
import type { IndexedRepo } from "../types";

export const revalidate = 900; // Revalidate data at most every 15 minutes

/**
 * @description Get repositories from database based on filters w/ pagination.
 * @returns An object.
 */
export const doIndexedSearch = cache(async function (
  formData: GenericObj,
): Promise<
  | ErrorObj
  | SuccessObj<{ items: IndexedRepo[]; currPage: number; hasNext: boolean }>
> {
  /* Validate input data */
  const schemaRes = iSFilters.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };

  const { languages = [], primary_label, labels = [] } = schemaRes.data;
  const { providers: types, minStars, maxStars } = schemaRes.data;
  const { page = 1, per_page } = schemaRes.data;

  const LIMIT = per_page && per_page > 1 ? per_page : 15; // Maximum results returned
  const cons: SQL[] = [];
  let repoSubset = new Set<string>();

  /* Basic Filters */
  if (types && types.length > 0) cons.push(inArray(repositories.type, types));
  if (minStars) cons.push(gte(repositories.stars, minStars));
  if (maxStars ?? maxStars === 0) cons.push(lte(repositories.stars, maxStars));
  if (primary_label) cons.push(eq(repositories._primaryLabel, primary_label));

  /* Relational Table Filters */
  if (languages && languages.length > 0) {
    // 1. Get all "RepoLang" entries that's in our "languages" constraint.
    //   -> Group them by "repoId" & "repoType", with a "numMatches" containing
    //      the number of matched "RepoLang" entries for a given repository.
    // 2. Possible repositories that match our filters will have "numMatches"
    //    equal to the number of values in the "languages" constraint.
    const matchedRepos = (
      await db
        .select({
          numMatches: sql<number>`count(*)`,
          repoPK: repoLangs.repoPK,
        })
        .from(repoLangs)
        .where(inArray(repoLangs.name, languages))
        .groupBy(({ repoPK }) => repoPK)
    )
      .filter((entry) => +entry.numMatches === languages.length)
      .map((entry) => entry.repoPK);
    repoSubset = new Set(matchedRepos);

    // No repositories found with all languages required.
    if (repoSubset.size === 0) {
      return { data: { items: [], currPage: page, hasNext: false } };
    }
  }

  if (labels && labels.length > 0) {
    // 1. If "repoSubset.size === 0", then we don't have a "languages" constraint.
    // 2. If we do have a "languages" constraint, "repoSubset.size" is
    //    guaranteed to be >0 and we'll find "RepoLabel" entries based off
    //    the repository ids in "repoSubset".

    const _cond =
      repoSubset.size > 0
        ? and(
            inArray(repoLabels.repoPK, [...repoSubset]),
            inArray(repoLabels.name, labels),
          )
        : inArray(repoLabels.name, labels);

    // Do the same thing as the "languages" constraint.
    const matchedRepos = (
      await db
        .select({
          numMatches: sql<number>`count(*)`,
          repoPK: repoLabels.repoPK,
        })
        .from(repoLabels)
        .where(_cond)
        .groupBy(({ repoPK }) => repoPK)
    )
      .filter((entry) => +entry.numMatches === labels.length)
      .map((entry) => entry.repoPK);
    repoSubset = new Set(matchedRepos);

    // No repositories found with all labels required.
    if (repoSubset.size === 0) {
      return { data: { items: [], currPage: page, hasNext: false } };
    }
  }

  // Reduce the number of possible repositories that can be searched.
  if (repoSubset.size > 0) {
    cons.push(inArray(repositories._pk, [...repoSubset]));
  }

  const results = await db.query.repositories.findMany({
    where: and(...cons),
    columns: { _primaryLabel: false, userId: false },
    with: {
      labels: { with: { label: true } },
      languages: { with: { language: true } },
      primaryLabel: true,
      user: true,
    },
    limit: LIMIT + 1,
    offset: (page <= 0 ? 0 : page - 1) * LIMIT,
  });

  return {
    data: {
      items: results.length > LIMIT ? results.slice(0, -1) : results,
      currPage: page,
      hasNext: results.length > LIMIT,
    },
  };
});
