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
import { RepoFormSchema, type RepoFormSchemaType } from "@/lib/zod/schema";
import { checkAuthConstraint } from "./utils";

export async function createRepository(
  formData: GenericObj,
): Promise<ErrorObj | IndexRepoReturn> {
  /* Validate input data */
  const schemaRes = RepoFormSchema.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const { author, name, provider, primary_label, labels = [] } = schemaRes.data;

  const authRes = await checkAuthConstraint(
    3,
    "User isn't old enough to index a repository.",
  );
  if (containsSAErr(authRes)) return authRes;

  /* Validate repository doesn't already exist in our database. */
  const repoExist = await db.query.repositories.findFirst({
    where: (fields, { and, eq }) =>
      and(
        eq(fields.type, provider),
        eq(fields.author, author),
        eq(fields.name, name),
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
  const lbInDB = await db.query.labels.findMany({
    where: (fields, { and, eq }) =>
      and(eq(fields.type, "regular"), inArray(fields.name, labels)),
  });
  if (lbInDB.length !== labels.length) {
    return { error: "Not all regular labels are valid." };
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
  props: RepoFormSchemaType,
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
  const repo = await db.query.repositories.findFirst({
    where: (fields, { eq }) => eq(fields._pk, _repoPK),
  });
  if (!repo) return { error: "Failed to insert repository." };

  /* Insert languages into database & create RepoLangs relations */
  for (const lang of langs.data) {
    try {
      await db.insert(languages).values(lang);
    } catch {}
    await db.insert(repoLangs).values({ name: lang.name, repoPK: _repoPK });
  }

  // Create label relations.
  const repoLabelRel = labels.map((lb) => ({ name: lb, repoPK: _repoPK }));
  if (repoLabelRel.length > 0) await db.insert(repoLabels).values(repoLabelRel);

  return { data: null };
}
