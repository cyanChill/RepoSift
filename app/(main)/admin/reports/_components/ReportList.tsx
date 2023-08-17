"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { completeReports, deleteReports } from "@/server-actions/admin-actions";

import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import { cleanDate } from "@/lib/utils/mutate";

type Report = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  user: { handle: string };
};

type Props = {
  isOwner: boolean;
  reports: Report[];
};

export default function ReportList({ isOwner, reports }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selIds, setSelIds] = useState<string[]>([]);

  async function markCompleted() {
    if (selIds.length === 0) return;
    try {
      const data = await completeReports(selIds);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success(
        `Successfully marked ${selIds.length} reports as completed.`,
      );
      setSelIds([]);
      router.refresh();
    } catch (err) {
      toastSAErrors(err);
    }
  }

  async function markSpam() {
    if (selIds.length === 0) return;
    try {
      const data = await deleteReports(selIds);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success(`Successfully deleted ${selIds.length} reports.`);
      setSelIds([]);
      router.refresh();
    } catch (err) {
      toastSAErrors(err);
    }
  }

  return (
    <fieldset
      disabled={isPending}
      className="flex w-full min-w-0 flex-col gap-4"
    >
      <div className="flex w-full flex-col items-center gap-2 self-end md:w-fit md:flex-row">
        <p className="font-semibold">Mark Selected As:</p>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => startTransition(() => markSpam())}
              className="reverse-btn w-fit bg-red-400 px-3 py-0.5 text-sm font-medium enabled:hover:bg-red-300 disabled:shadow-none"
              disabled={selIds.length === 0}
            >
              Spam
            </button>
          )}
          <button
            onClick={() => startTransition(() => markCompleted())}
            className="reverse-btn w-fit px-3 py-0.5 text-sm font-medium disabled:shadow-none"
            disabled={selIds.length === 0}
          >
            Completed
          </button>
        </div>
      </div>
      <section className="card overflow-auto p-0">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-black child:p-2">
              <th className="w-48 min-w-[12rem] font-semibold">Created At</th>
              <th className="min-w-[25rem] font-semibold">
                Report Information
              </th>
              <th className="w-40 min-w-[10rem] max-w-[10rem] font-semibold">
                Reported By
              </th>
              <th className="w-12 min-w-[3rem] font-semibold" />
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <ReportRow
                key={report.id}
                report={report}
                toggleSelected={() =>
                  setSelIds((prev) => {
                    const exists = prev.find((id) => id === report.id);
                    return exists
                      ? prev.filter((id) => id !== report.id)
                      : [...prev, report.id];
                  })
                }
              />
            ))}
          </tbody>
        </table>
      </section>
    </fieldset>
  );
}

type ReportRowProps = {
  report: Report;
  toggleSelected: () => void;
};

const ReportRow = ({ report, toggleSelected }: ReportRowProps) => {
  const [expand, setExpand] = useState(false);

  const jsonDesc = JSON.parse(report.description) as string;
  const minDesc =
    jsonDesc.length > 125 ? jsonDesc.substring(0, 125) + "..." : jsonDesc;

  return (
    <tr key={report.id} className="border-b-2 border-black last:border-b-0">
      <td className="p-2 align-top text-sm">{cleanDate(report.createdAt)}</td>
      <td className="p-2 align-top">
        <p className="font-medium">{report.title}</p>
        <p className="whitespace-pre-wrap text-sm">
          {expand ? jsonDesc : minDesc}
          {jsonDesc.length > 125 && (
            <button
              onClick={() => setExpand((prev) => !prev)}
              className="px-2 text-sm font-medium text-blue-700 hover:underline"
            >
              See {expand ? "Less" : "More"}
            </button>
          )}
        </p>
      </td>
      <td className="w-40 min-w-0 max-w-[10rem] p-2 align-top text-sm">
        <a
          href={`/u/@${report.user.handle}`}
          target="_blank"
          className="block truncate font-medium hover:underline"
        >
          @{report.user.handle}
        </a>
      </td>
      <td className="p-2 text-center align-top">
        <input
          type="checkbox"
          onClick={toggleSelected}
          className="enabled:hover:cursor-pointer"
        />
      </td>
    </tr>
  );
};
