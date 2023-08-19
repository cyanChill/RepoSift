import Image from "next/image";
import { VscLinkExternal, VscChevronRight } from "react-icons/vsc";

import type { IndexedRepo } from "@/server-actions/types";
import { cn } from "@/lib/utils";
import { isNum } from "@/lib/utils/validation";

type Props = {
  selectedIdx: number | undefined;
  currIdx: number;
  onClick: () => void;
  result: IndexedRepo;
};

export default function ResultsListItem({
  selectedIdx,
  currIdx,
  onClick,
  result,
}: Props) {
  return (
    <article
      onClick={onClick}
      className={cn(
        "card relative flex items-center gap-2 overflow-hidden p-2 transition duration-150 md:p-4",
        "border-y-1.5 first:border-t-3 last:border-b-3",
        {
          "my-2 translate-x-1.5 border-y-3 bg-yellow-400 duration-300 first:mt-0 last:mb-0 md:my-4":
            currIdx === selectedIdx,
          "hover:cursor-pointer hover:bg-yellow-200": currIdx !== selectedIdx,
          "border-b-3": isNum(selectedIdx) && currIdx === selectedIdx - 1,
          "border-t-3": isNum(selectedIdx) && currIdx === selectedIdx + 1,
        },
      )}
    >
      <div className="w-full min-w-0">
        <p className="truncate font-medium md:text-lg">
          {result.author}/{result.name}
        </p>
        <p className="line-clamp-3 text-sm md:text-base">
          {result.description ?? "No description."}
        </p>
      </div>
      {currIdx !== selectedIdx ? (
        <VscLinkExternal className="h-6 w-6 flex-shrink-0 md:h-8 md:w-8" />
      ) : (
        <VscChevronRight className="h-6 w-6 flex-shrink-0 md:h-8 md:w-8" />
      )}
      {/* Provider Indicator */}
      <Image
        src={`/assets/icons/${result.type}.svg`}
        alt=""
        height={96}
        width={96}
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 md:h-32 md:w-32"
      />
    </article>
  );
}
