"use client";
import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

import type { IndexedRepo } from "@/server-actions/cached/get-repos";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { isNum } from "@/lib/utils/validation";
import RepoCard from "@/components/RepoCard";
import ResultsListItem from "./results-list-item";

type Props = {
  results: IndexedRepo[];
};

export default function Results({ results }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number>();
  const isMobile = useIsMobile();

  useEffect(() => {
    setSelectedIdx(undefined);
  }, [results]);

  return (
    <>
      {/* Result List */}
      <section className="w-full min-w-0">
        {results.map((result, idx) => (
          <ResultsListItem
            key={result.id}
            selectedIdx={selectedIdx}
            currIdx={idx}
            onClick={() => setSelectedIdx(idx)}
            result={result}
          />
        ))}
      </section>

      <section className="fixed left-0 top-1/2 z-[110] h-min w-full min-w-0 -translate-y-1/2 md:sticky md:top-24 md:h-[50vh] md:max-h-[50rem] md:translate-y-0">
        {isNum(selectedIdx) && results[selectedIdx] && (
          <RepoCard
            result={results[selectedIdx]}
            onClose={() => setSelectedIdx(undefined)}
          />
        )}
      </section>
      {/* Backdrop Blur */}
      <Transition
        show={isNum(selectedIdx) && isMobile}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
        className="fixed left-0 top-0 z-[105] h-screen w-screen bg-black/50 backdrop-blur-sm md:hidden"
        onClick={() => setSelectedIdx(undefined)}
      />
    </>
  );
}
