import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { cn, getOldestAge, didFailMonthConstraint } from "@/lib/utils";

export const metadata = {
  title: "RepoSift | Contribute a Repository",
};

export default async function ContributeRepositoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/join?callbackUrl=/contribute/repository");
  }

  // Make sure user satisfies account age constraint for feature
  if (didFailMonthConstraint(3, getOldestAge(session.user.linkedAccounts))) {
    redirect("/contribute");
  }

  return (
    <>
      <h2>Contribute a Repository to RepoSift</h2>
    </>
  );
}
