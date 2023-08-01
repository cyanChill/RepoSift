"use client";
import { useState, useRef, useTransition } from "react";

import { simpleSearch } from "@/server-actions/simple-search";
import type { Results } from "./types";
import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import { formDataToObj, removeEmptyProperties } from "@/lib/utils/mutate";
import SearchForm from "./search-form";
import ResultsCard from "./results-card";

export default function SSClientPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [results, setResults] = useState<Results>(undefined);
  const [isPending, startTransition] = useTransition();

  async function queueSearch(formData: FormData) {
    const cleanedData = removeEmptyProperties(formDataToObj(formData));
    try {
      const data = await simpleSearch(cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      setResults({
        error: false,
        provider: data.data.provider,
        items: data.data.items,
      });
    } catch (err) {
      toastSAErrors(err);
      setResults({ error: true });
    }
  }

  const callForm = () => {
    if (formRef.current) formRef.current.requestSubmit();
  };

  return (
    <>
      <SearchForm
        ref={formRef}
        action={(data) => startTransition(() => queueSearch(data))}
        isSubmitting={isPending}
      />
      <ResultsCard
        isRefreshing={isPending}
        refreshResults={callForm}
        results={results}
      />
    </>
  );
}
