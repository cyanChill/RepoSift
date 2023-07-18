import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export default async function ContributePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/join?callbackUrl=/contribute");
  }

  return (
    <main className="w-full max-w-appContent">
      <h1>Contribute to RepoSift</h1>
    </main>
  );
}
