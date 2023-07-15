import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import type { PageProps } from "@/lib/types";
import { firstStrParam } from "@/lib/utils";
import { LoginProviders } from "./_components/login-providers";

export default async function JoinPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    // Protect against redirecting to other sites
    const cbRoute = firstStrParam(searchParams.callbackUrl) || "/";
    redirect(cbRoute.startsWith("/") ? cbRoute : "/");
  }

  return (
    <main className="overflow-auto p-8 md:px-xprose md:pt-16">
      <header className="text-3xl">
        <Link href="/" className="font-semibold">
          RepoSift
        </Link>
        <h1 className="mt-16 font-medium">Join</h1>
      </header>
      <div className="pt-8 text-lg">
        <LoginProviders />
      </div>
    </main>
  );
}
