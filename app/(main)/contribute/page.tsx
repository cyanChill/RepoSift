import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { IoPricetags } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";

import { authOptions } from "@/lib/auth";
import type { PageProps } from "@/lib/types";
import { getOldestAge } from "@/lib/utils/mutate";
import { didFailMonthConstraint } from "@/lib/utils/validation";
import { getFilters } from "@/server-actions/cached/get-filters";
import BannedScreen from "@/components/BannedScreen";
import ContributeSelector from "./_components/contribute-selector";
import LabelForm from "./_components/label-form";
import RepositoryForm from "./_components/repository-form";

export const metadata = {
  title: "RepoSift | Contribute",
};

export default async function ContributePage({ searchParams }: PageProps) {
  const { labels } = await getFilters();

  const session = await getServerSession(authOptions);

  if (!session) redirect("/join?callbackUrl=/contribute");

  if (session.user.role === "banned") {
    return <BannedScreen reason={session.user.banReason ?? undefined} />;
  }

  // Get the date from the oldest account amongst the linked accounts
  const oldestAge = getOldestAge(session.user.linkedAccounts);
  const failedRepoConstraint = didFailMonthConstraint(3, oldestAge);
  const failedLabelConstraint = didFailMonthConstraint(12, oldestAge);

  if (searchParams.type === "repository" && !failedRepoConstraint) {
    return <RepositoryForm labels={labels} />;
  }

  if (searchParams.type === "label" && !failedLabelConstraint) {
    return <LabelForm />;
  }

  return (
    <>
      <ContributeSelector
        href="/contribute?type=repository"
        Icon={SiBookstack}
        title="Index a Repository"
        description="Help create a library of better labeled repositories to help users better find what they're looking for."
        btnText="Start Indexing"
        bgClr={{ icon: "bg-red-500", button: "bg-green-400" }}
        constraint={3}
        disabled={failedRepoConstraint}
      />
      <ContributeSelector
        href="/contribute?type=label"
        Icon={IoPricetags}
        title="Suggest a Label"
        description="Help others index repositories better by creating labels that can be tailored to the interest of others."
        btnText="Suggest a Label"
        bgClr={{ icon: "bg-sky-300", button: "bg-yellow-400" }}
        constraint={12}
        disabled={failedLabelConstraint}
      />
    </>
  );
}
