"use client";
import { useState } from "react";

import type { IndexedRepo } from "@/server-actions/cached/get-repos";
import ResultsListItem from "./results-list";

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

      <section>Results Preview</section>

      {/* Pagination Component */}
      <div>Pagination</div>
    </>
  );
}
