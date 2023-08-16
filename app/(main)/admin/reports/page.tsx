import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { authOptions } from "@/lib/auth";

import ReportList from "./_components/ReportList";

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "owner"].includes(session.user.role)) {
    redirect("/");
  }

  const reports = await db.query.reports.findMany({
    where: (fields, { eq }) => eq(fields.isCompleted, false),
    columns: { userId: false },
    with: { user: { columns: { handle: true } } },
    orderBy: (reports, { desc }) => [desc(reports.createdAt)],
  });

  return (
    <main className="mx-auto w-full max-w-appContent p-3 py-5 md:py-20">
      <p className="md:text-lg">In this menu, you are able to:</p>
      <ul className="mb-4 ml-8 list-disc text-sm md:mb-8 md:text-base">
        <li>View all the reports submitted by users.</li>
        <li>
          As an <span className="font-semibold">admin or owner</span> you can
          mark reports as complete if {"you've"} taken the appropriate actions
          to resolve the report.
        </li>
        <li>
          If you{" "}
          <span className="font-semibold">{"can't"} resolve the issue</span>{" "}
          specified in the report,{" "}
          <span className="font-semibold">
            DO NOT mark the report as completed
          </span>
          . Wait for the owner to take action.
        </li>
        {session.user.role === "owner" && (
          <li>
            As an <span className="font-semibold">owner</span> you can mark
            reports as {`"spam"`}, which will{" "}
            <span className="font-semibold">DELETE the report</span>.
          </li>
        )}
      </ul>
      <hr className="my-4 h-px border-0 bg-black md:my-8" />

      <ReportList isOwner={session.user.role === "owner"} reports={reports} />
    </main>
  );
}
