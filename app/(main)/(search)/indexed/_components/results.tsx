"use client";
import { useState } from "react";

import type { IndexedRepo } from "@/server-actions/cached/get-repos";
import { isNum } from "@/lib/utils/validation";
import ResultsListItem from "./results-list-item";
import ResultPreview from "./result-preview";

type Props = {
  results: IndexedRepo[];
};

export default function Results({ results }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number>();

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

      <section className="sticky top-24 h-min w-full min-w-0">
        {isNum(selectedIdx) && (
          <ResultPreview
            result={results[selectedIdx]}
            onClose={() => setSelectedIdx(undefined)}
          />
        )}
      </section>

      {/* Pagination Component */}
      <div>Pagination</div>
    </>
  );
}
