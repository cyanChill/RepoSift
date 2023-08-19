import { db } from "@/db";

import type { AuthProviders } from "@/lib/zod/utils";
import { providersVal } from "@/lib/utils/constants";
import DisplayedRepo from "./_components/displayed-repo";

type Props = { params: { type: AuthProviders; repoId: string } };

export async function generateMetadata({ params: { type, repoId } }: Props) {
  let pageTitle = "";

  if (!providersVal.includes(type)) {
  } else {
    const repo = await db.query.repositories.findFirst({
      where: (fields, { eq }) => eq(fields._pk, `${repoId}|${type}`),
      columns: { name: true, author: true },
    });
    if (repo) pageTitle = `| ${repo.author}/${repo.name}`;
  }

  return { title: `RepoSift ${pageTitle}` };
}

export default async function RepositoryPage({
  params: { type, repoId },
}: Props) {
  if (!providersVal.includes(type)) {
    throw new Error("Invalid repository.");
  }

  const repo = await db.query.repositories.findFirst({
    where: (fields, { eq }) => eq(fields._pk, `${repoId}|${type}`),
    columns: { _primaryLabel: false, userId: false },
    with: {
      labels: { with: { label: true } },
      languages: { with: { language: true } },
      primaryLabel: true,
      user: true,
    },
  });

  if (!repo) {
    throw new Error("Repository doesn't exist or hasn't been indexed yet.");
  }

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
      <DisplayedRepo repository={repo} />
    </main>
  );
}
