import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { IoPricetags } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";

import { db } from "@/db";

import { authOptions } from "@/lib/auth";
import type { PageProps } from "@/lib/types";
import { getOldestAge, didFailMonthConstraint } from "@/lib/utils";
import ContributeSelector from "./_components/contribute-selector";
import LabelForm from "./_components/label-form";
import RepositoryForm from "./_components/repository-form";

export const metadata = {
  title: "RepoSift | Contribute",
};

type Labels = {
  primary: { name: string; value: string }[];
  regular: { name: string; value: string }[];
};

export default async function ContributePage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/join?callbackUrl=/contribute");

  // Get the date from the oldest account amongst the linked accounts
  const oldestAge = getOldestAge(session.user.linkedAccounts);
  const failedRepoConstraint = didFailMonthConstraint(3, oldestAge);
  const failedLabelConstraint = didFailMonthConstraint(12, oldestAge);

  if (searchParams.type === "repository" && !failedRepoConstraint) {
    const allLabels = await db.query.labels.findMany({
      columns: { userId: false },
    });
    const labels: Labels = { primary: [], regular: [] };

    allLabels.forEach((lb) => {
      if (lb.type === "primary") {
        labels.primary.push({ name: lb.display, value: lb.name });
      } else {
        labels.regular.push({ name: lb.display, value: lb.name });
      }
    });

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
