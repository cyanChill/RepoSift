"use client";
import { useTransition } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { IoAlertSharp, IoRefreshSharp } from "react-icons/io5";
import { toast } from "react-hot-toast";

import type { IndexedRepo } from "@/server-actions/cached/get-repos";
import { refreshRepository } from "@/server-actions/refresh-repo";

import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import { isNotOneWeekOld } from "@/lib/utils/validation";
import { getProviderIcon, getRepoLink } from "@/app/(main)/_components/utils";

type Props = {
  result: IndexedRepo;
  onClose: () => void;
};

/*
  TODO: Eventually implement the ability to report the repository.
*/
export default function RepoCard({ result, onClose }: Props) {
  const router = useRouter();
  const { isAuth } = useAuth();
  const [isPending, startTransition] = useTransition();

  // If repository data has been recently refreshed
  const reRefreshed = isNotOneWeekOld(result.lastUpdated);

  const onRefresh = async () => {
    if (reRefreshed) return; // Return if not allowed to refresh
    try {
      const data = await refreshRepository(result.id);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully refreshed repository.");
      router.refresh();
    } catch (err) {
      toastSAErrors(err);
    }
  };

  const shadowStyle = {
    "--bs-offset-x": "2px",
    "--bs-offset-y": "2px",
  } as CSSProperties;
  const baseLabelClass =
    "card flex w-fit items-center gap-2 border-2 border-l-0 px-1 py-0.5 disabled:brightness-75";

  return (
    <article className="card h-[65vh] max-h-[50rem] min-h-[12.5rem] overflow-hidden p-0 md:h-[50vh]">
      {/* "Header" */}
      <div className="flex justify-end border-b-2 border-black bg-turquoise-200 px-2 py-1">
        <button onClick={onClose} title="Close">
          <MdClose className="pointer-events-none h-8 w-8 flex-shrink-0" />
        </button>
      </div>
      {/* "Main Content" */}
      <section className="flex h-full max-h-[calc(100%-42px)] flex-col overflow-y-auto p-4">
        <p className="mb-2 flex w-full min-w-0 items-center gap-1 md:text-lg">
          {getProviderIcon(result.type)}
          <a
            href={getRepoLink(result.type, result.author, result.name)}
            target="_blank"
            className="truncate font-medium hocus:underline"
          >
            {result.author}/{result.name}
          </a>
        </p>
        {/* Stars, Languages, Labels */}
        <div
          style={shadowStyle}
          className="mb-4 flex flex-wrap border-l-2 border-black text-xs font-medium"
        >
          <p className={cn(baseLabelClass, "bg-yellow-300")}>
            <FaStar /> {result.stars}
          </p>
          {result.languages.map((lang) => (
            <p key={lang.name} className={cn(baseLabelClass, "bg-purple-300")}>
              {lang.language?.display}
            </p>
          ))}
          <p className={cn(baseLabelClass, "bg-green-300")}>
            {result.primaryLabel.display}
          </p>
          {result.labels.map((lb) => (
            <p key={lb.name} className={cn(baseLabelClass, "bg-blue-300")}>
              {lb.label?.display}
            </p>
          ))}
        </div>
        {/* Description */}
        <p className="mb-2 text-sm">
          {result.description ?? "No description."}
        </p>
        {/* Maintain Link */}
        {result.primaryLabel.name === "abandoned" && (
          <p className="mb-2 text-sm">
            <span className="font-medium underline">Maintain Link:</span>{" "}
            {result.maintainLink ? (
              <a href={result.maintainLink} target="_blank">
                {result.maintainLink}
              </a>
            ) : (
              "No maintain link found."
            )}
          </p>
        )}
        {/* Actions & Info */}
        <div
          style={shadowStyle}
          className="mt-auto grid gap-2 text-xs font-medium sm:grid-cols-[auto,min-content]"
        >
          <div>
            {/* Suggester */}
            <div className="flex">
              <p className={cn(baseLabelClass, "border-l-2 bg-orange-300")}>
                Suggested By
              </p>
              <a
                href={`/u/@${result.user.handle}`}
                target="_blank"
                className={cn(baseLabelClass, "hover:underline")}
              >
                @{result.user.handle}
              </a>
            </div>
            {/* LastUpdated */}
            <div className="-mt-0.5 flex">
              <p className={cn(baseLabelClass, "border-l-2 bg-violet-300")}>
                Last Updated
              </p>
              <p className={baseLabelClass}>
                {new Date(result.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
          {/* Actions */}
          <fieldset
            style={shadowStyle}
            className="flex h-min self-end"
            disabled={isPending}
          >
            {/* Report Repository */}
            {isAuth && (
              <button
                className={cn(
                  baseLabelClass,
                  "border-l-2 bg-red-300 px-0.5 enabled:hover:bg-red-400",
                )}
                onClick={() => {
                  console.log("Sending Report...");
                }}
                title="Report Repository"
              >
                <IoAlertSharp className="pointer-events-none h-4 w-4" />
              </button>
            )}
            {/* Refresh Data */}
            <button
              className={cn(
                baseLabelClass,
                "bg-green-300 px-0.5 enabled:hover:bg-green-400",
                { "border-l-2": !isAuth },
              )}
              onClick={() => startTransition(() => onRefresh())}
              disabled={reRefreshed}
              title="Refresh Repository Data"
            >
              <IoRefreshSharp className="pointer-events-none h-4 w-4" />
            </button>
          </fieldset>
        </div>
      </section>
    </article>
  );
}
