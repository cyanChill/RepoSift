import type { CSSProperties } from "react";
import { MdClose } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { IoAlertSharp, IoRefreshSharp } from "react-icons/io5";

import type { IndexedRepo } from "@/server-actions/cached/get-repos";
import { cn } from "@/lib/utils";
import { getProviderIcon, getRepoLink } from "../../_components/utils";

type Props = {
  result: IndexedRepo;
  onClose: () => void;
};

/*
  TODO: Eventually implement the ability to report & refresh the repository data.
*/
export default function ResultPreview({ result, onClose }: Props) {
  const shadowStyle = {
    "--bs-offset-x": "2px",
    "--bs-offset-y": "2px",
  } as CSSProperties;
  const baseLabelClass =
    "just-black flex w-fit items-center gap-2 border-2 border-l-0 px-1 py-0.5 shadow-full";

  return (
    <article className="just-black h-[50vh] max-h-[50rem] min-h-[12.5rem] overflow-hidden border-2 bg-white shadow-full">
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
                className={cn(baseLabelClass, "bg-white hover:underline")}
              >
                @{result.user.handle}
              </a>
            </div>
            {/* LastUpdated */}
            <div className="-mt-0.5 flex">
              <p className={cn(baseLabelClass, "border-l-2 bg-violet-300")}>
                Last Updated
              </p>
              <p className={cn(baseLabelClass, "bg-white")}>
                {new Date(result.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
          {/* Actions */}
          <div style={shadowStyle} className="flex h-min self-end">
            {/* Report Repository */}
            <button
              className={cn(
                baseLabelClass,
                "border-l-2 bg-red-300 px-0.5 hover:bg-red-400",
              )}
              onClick={() => {
                console.log("Sending Report...");
              }}
              title="Report Repository"
            >
              <IoAlertSharp className="pointer-events-none h-4 w-4" />
            </button>
            {/* Refresh Data */}
            <button
              className={cn(
                baseLabelClass,
                "bg-green-300 px-0.5 hover:bg-green-400",
              )}
              onClick={() => {
                console.log("Refreshing Data...");
              }}
              title="Refresh Repository Data"
            >
              <IoRefreshSharp className="pointer-events-none h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </article>
  );
}
