import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { db } from "@/db";
import type { Repository } from "@/db/schema/main";
import { getFilters } from "@/server-actions/cached/get-filters";
import { authOptions } from "@/lib/auth";

import type { PageProps } from "@/lib/types";
import { firstStrParam } from "@/lib/utils/url";
import { BaseForm, ManageRepoForm } from "../_components/forms";

export default async function AdminRepositoriesPage({
  searchParams,
}: PageProps) {
  const { labels } = await getFilters();

  const session = await getServerSession(authOptions);
  if (!session || !["admin", "owner"].includes(session.user.role)) {
    redirect("/");
  }

  const { repoId: unsafeRepoId } = searchParams;
  // Expected form is: "[{provider}] {author}/{repoName}"
  const repoId = firstStrParam(unsafeRepoId);
  let repoType = "";
  let repoAuthor = "";
  let repoName = "";

  try {
    repoType = repoId?.split(" ")[0].slice(1, -1).trim() ?? "";
    repoAuthor = repoId?.split(" ")[1].split("/")[0].trim() ?? "";
    repoName = repoId?.split(" ")[1].split("/")[1].trim() ?? "";
  } catch {}

  let repo: Omit<Repository, "languages" | "user"> | undefined;
  if (repoType && repoAuthor && repoName) {
    repo = await db.query.repositories.findFirst({
      where: (fields, { and, sql }) =>
        and(
          sql`lower(${fields.type}) = ${repoType.toLowerCase()}`,
          sql`lower(${fields.author}) = ${repoAuthor.toLowerCase()}`,
          sql`lower(${fields.name}) = ${repoName.toLowerCase()}`,
        ),
      with: { primaryLabel: true, labels: { with: { label: true } } },
    });
  }

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
      <BaseForm
        variant="repositories"
        fieldName="repoId"
        placeholder="ie: [GitHub] author/repoName"
        initVal={repoId}
      />

      {repoId && !repo && (
        <p className="px-2  font-medium text-error">
          Error: Repository not found or invalid query format.
        </p>
      )}

      {repo && (
        <section className="mt-8 flex flex-col gap-4 px-2">
          <ManageRepoForm repository={repo} labels={labels} />
        </section>
      )}
    </main>
  );
}
