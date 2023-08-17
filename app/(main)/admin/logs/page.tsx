import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { authOptions } from "@/lib/auth";

import { cleanDate } from "@/lib/utils/mutate";

export const metadata = {
  title: "RepoSift | View Logs",
};

export default async function AdminLogsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "owner"].includes(session.user.role)) {
    redirect("/");
  }

  const logs = await db.query.logs.findMany({
    with: { user: { columns: { handle: true } } },
    orderBy: (logs, { desc }) => [desc(logs.createdAt)],
  });

  return (
    <main className="mx-auto w-full max-w-appContent p-3 py-5 md:py-20">
      <p className="md:text-lg">
        In this menu, you can view all the administrative related logs such as:
      </p>
      <ul className="mb-4 ml-8 list-disc text-sm md:mb-8 md:text-base">
        <li>When an admin manually updates a {"user's"} role.</li>
        <li>When you rename or delete a {`"regular"`} label.</li>
        <li>When you update or delete a repository.</li>
        <li>When you handle a report.</li>
      </ul>
      <hr className="my-4 h-px border-0 bg-black md:my-8" />

      <section className="card overflow-auto p-0">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-black child:p-2">
              <th className="w-48 min-w-[12rem] font-semibold">Created At</th>
              <th className="min-w-[25rem] font-semibold">Log Action</th>
              <th className="w-40 min-w-[10rem] max-w-[10rem] font-semibold">
                Handled By
              </th>
              <th className="w-20 min-w-[5rem] font-semibold" />
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b-2 border-black text-sm last:border-b-0"
              >
                <td className="p-2 align-top">{cleanDate(log.createdAt)}</td>
                <td className="p-2 align-top font-medium">{log.action}</td>
                <td className="w-40 min-w-0 max-w-[10rem] p-2 align-top">
                  <a
                    href={`/u/@${log.user.handle}`}
                    target="_blank"
                    className="block truncate font-medium hover:underline"
                  >
                    @{log.user.handle}
                  </a>
                </td>
                <td className="p-2 text-center align-top">
                  {log.reportId && (
                    <a
                      href={`/admin/reports/${log.reportId}`}
                      target="_blank"
                      className="text-blue-700 hover:underline"
                    >
                      Report
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
