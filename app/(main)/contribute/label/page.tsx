import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { cn, getOldestAge, didFailMonthConstraint } from "@/lib/utils";

export const metadata = {
  title: "RepoSift | Contribute a Label",
};

export default async function ContributeLabelPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/join?callbackUrl=/contribute/label");
  }

  // Make sure user satisfies account age constraint for feature
  if (didFailMonthConstraint(12, getOldestAge(session.user.linkedAccounts))) {
    redirect("/contribute");
  }

  return (
    <main className="mx-auto w-full max-w-appContent p-3 py-5 md:py-20">
      <h2>Contribute a Label to RepoSift</h2>
    </main>
  );
}
