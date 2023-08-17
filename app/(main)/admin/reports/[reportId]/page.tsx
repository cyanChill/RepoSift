import type { CSSProperties } from "react";
import { BsPatchCheckFill } from "react-icons/bs";

import { db } from "@/db";

import { cn } from "@/lib/utils";
import Browser from "@/components/Browser";

type Props = { params: { reportId: string } };

export const metadata = {
  title: "RepoSift | View Report",
};

export default async function ReportPage({ params: { reportId } }: Props) {
  const report = await db.query.reports.findFirst({
    where: (fields, { eq }) => eq(fields.id, reportId),
    with: { user: true },
  });

  if (!report) throw new Error("Report doesn't exist.");

  const baseLabelClass =
    "card flex w-fit items-center gap-2 border-2 border-l-0 px-1 py-0.5 disabled:brightness-75";

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
      <Browser className="h-full rounded-none bg-white">
        <Browser.Header className="bg-gray-200 px-4">
          <Browser.TrafficLights size={16} withAction={false} />
          <Browser.SearchBar className="flex h-8 items-center text-base">
            {" "}
          </Browser.SearchBar>
        </Browser.Header>
        <Browser.Content className="p-2 md:p-4">
          <p className="mb-2 font-medium md:text-2xl">{report.title}</p>
          {report.isCompleted && (
            <p className="mb-4 flex w-fit items-center gap-1 rounded-md border border-yellow-400 bg-yellow-200 px-2 py-0.5 text-xs font-medium">
              <BsPatchCheckFill /> Completed
            </p>
          )}
          <p className="mb-8 text-sm md:mb-20">
            {JSON.parse(report.description)}
          </p>

          <div
            style={
              {
                "--bs-offset-x": "2px",
                "--bs-offset-y": "2px",
              } as CSSProperties
            }
            className="text-xs font-medium"
          >
            {/* Reporter */}
            <div className="flex">
              <p className={cn(baseLabelClass, "border-l-2 bg-orange-300")}>
                Reported By
              </p>
              <a
                href={`/u/@${report.user.handle}`}
                target="_blank"
                className={cn(baseLabelClass, "hover:underline")}
              >
                @{report.user.handle}
              </a>
            </div>
            {/* LastUpdated */}
            <div className="-mt-0.5 flex">
              <p className={cn(baseLabelClass, "border-l-2 bg-violet-300")}>
                Submitted On
              </p>
              <p className={baseLabelClass}>
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </Browser.Content>
      </Browser>
    </main>
  );
}
