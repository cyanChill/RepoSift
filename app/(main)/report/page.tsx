import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import type { PageProps } from "@/lib/types";
import { getPathWithQuery } from "@/lib/utils/headers";
import { firstStrParam } from "@/lib/utils/url";
import ReportForm from "./_components/report-form";

export const metadata = {
  title: "RepoSift | Report",
};

export default async function ReportPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/join?callbackUrl=${getPathWithQuery()}`);

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
      <p className="md:text-lg">
        Fill out the form to report any bugs, incorrect information,
        suggestions, or fixes you may have for RepoSift as a site.
      </p>
      <ul className="mb-4 ml-8 list-disc text-sm md:mb-8 md:text-base">
        <li>
          If reporting a{" "}
          <span className="font-semibold">repository, label, or user</span>,
          mention it in the title and specify the offending party. For example:{" "}
          <span className="font-semibold">[Label Report] labelName</span>.
        </li>
        <li>
          If reporting directly from a user profile or repository card, fields
          will be automatically populated.
        </li>
        <li>
          If you want to suggest a link that maintains an {`"Abandoned"`}{" "}
          repository, make sure you put it in the description.
        </li>
      </ul>
      <hr className="my-4 h-px border-0 bg-black md:my-8" />

      <ReportForm
        title={firstStrParam(searchParams.title) ?? ""}
        description={firstStrParam(searchParams.description) ?? ""}
      />
    </main>
  );
}
