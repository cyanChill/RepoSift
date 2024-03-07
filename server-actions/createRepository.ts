"use server";
import { inArray } from "drizzle-orm";

import { db } from "@/db";
import {
  repositories,
  repoLangs,
  repoLabels,
  languages,
} from "@/db/schema/main";

import { getGitHubRepoData, getGitHubRepoLang } from "./providerSearch";
import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { containsSAErr, getZodMsg } from "@/lib/utils/error";
import { checkAuthConstraint } from "./utils";
import { contributedRepo, type ContributedRepo } from "./schema";

export async function createRepository(
  formData: GenericObj,
): Promise<ErrorObj | IndexRepoReturn> {
  /* Validate input data */
  const schemaRes = contributedRepo.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const { author, name, provider, primary_label, labels = [] } = schemaRes.data;

  const authRes = await checkAuthConstraint(
    3,
    "User isn't old enough to index a repository.",
  );
  if (containsSAErr(authRes)) return authRes;

  /* Validate repository doesn't already exist in our database. */
  const repoExist = await db.query.repositories.findFirst({
    where: (fields, { and, eq, sql }) =>
      and(
        eq(fields.type, provider),
        sql`lower(${fields.author}) = ${author.toLowerCase()}`,
        sql`lower(${fields.name}) = ${name.toLowerCase()}`,
      ),
  });
  if (repoExist) return { error: "That repository has already been indexed." };
  /* Validate primary label exists. */
  const pLabelExist = await db.query.labels.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.type, "primary"), eq(fields.name, primary_label)),
  });
  if (!pLabelExist) return { error: "The primary label doesn't exist." };
  /* Validate all regular labels exists. */
  if (labels.length > 0) {
    const lbInDB = await db.query.labels.findMany({
      where: (fields, { and, eq }) =>
        and(eq(fields.type, "regular"), inArray(fields.name, labels)),
    });
    if (lbInDB.length !== labels.length) {
      return { error: "Not all regular labels are valid." };
    }
  }

  if (provider === "github") {
    return await indexGitHubRepo(schemaRes.data, authRes.data.id);
  }
  // TODO: Eventually implement Indexed Search with GitLab & Bitbucket's
  const UNIMPLEMENTED_ERROR = {
    error: `You currently can't index a repository from the ${provider} provider option.`,
  };
  if (provider === "gitlab") return UNIMPLEMENTED_ERROR;
  if (provider === "bitbucket") return UNIMPLEMENTED_ERROR;

  return { error: "Invalid provider was provided." };
}

type IndexRepoReturn = Promise<ErrorObj | SuccessObj<null>>;

async function indexGitHubRepo(
  props: ContributedRepo,
  suggesterId: string,
): IndexRepoReturn {
  const { author, name, provider, primary_label, labels = [] } = props;

  const searchResult = await getGitHubRepoData({
    type: "new",
    author,
    repoName: name,
  });
  if (containsSAErr(searchResult)) return searchResult;
  const { data: repository } = searchResult;
  const strId = String(repository.id);

  /* Get Repository Languages */
  const langs = await getGitHubRepoLang(repository.languages_url);
  if (containsSAErr(langs)) return langs;

  try {
    const _repoPK = `${strId}|${provider}`;
    // Insert repository
    await db.insert(repositories).values({
      _pk: _repoPK,
      id: strId,
      type: provider,
      author: repository.owner?.login ?? author,
      name: repository.name,
      description: repository.description,
      stars: repository.stargazers_count,
      _primaryLabel: primary_label,
      userId: suggesterId,
      lastUpdated: new Date(),
    });

    // Insert languages into database & create RepoLangs relations
    if (langs.data.length > 0) {
      await db.insert(languages).values(langs.data).onConflictDoNothing();

      await db
        .insert(repoLangs)
        .values(langs.data.map(({ name }) => ({ name, repoPK: _repoPK })));
    }

    // Create label relations.
    if (labels.length > 0) {
      await db
        .insert(repoLabels)
        .values(labels.map((name) => ({ name, repoPK: _repoPK })));
    }

    return { data: null };
  } catch (err) {
    console.log(err);
    return { error: "Failed to index this GitHub repository." };
  }
}
