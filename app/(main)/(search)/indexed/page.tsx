import { getFilters } from "@/server-actions/cached/get-filters";
import { getIndexedRepos } from "@/server-actions/cached/get-repos";

import type { PageProps } from "@/lib/types";
import { containsSAErr } from "@/lib/utils/error";
import { arrayTransform, removeEmptyProperties } from "@/lib/utils/mutate";
import FilterButtons from "./_components/filter-buttons";
import Results from "./_components/results";

export default async function IndexedSearchPage({ searchParams }: PageProps) {
  const { labels, languages } = await getFilters();
  const { providers, languages: langs, labels: lbs, ...rest } = searchParams;

  const transformedSearchParams = removeEmptyProperties({
    providers: providers ? arrayTransform(providers as string) : undefined,
    languages: langs ? arrayTransform(langs as string) : undefined,
    labels: lbs ? arrayTransform(lbs as string) : undefined,
    ...rest,
  });

  const results = await getIndexedRepos(transformedSearchParams);
  console.log(results);

  return (
    <main className="mx-auto w-full max-w-appContent p-3 py-5 md:py-20">
      <FilterButtons
        currFilters={transformedSearchParams}
        labels={labels}
        languages={languages}
      />

      <section className="mt-4 grid min-h-[20rem] gap-4 md:mt-8 md:grid-cols-2">
        {containsSAErr(results) ? (
          <section className="w-full min-w-0">
            <p className="font-medium text-error">
              Some errors were encountered when searching for your results:
            </p>
            <ul className="ml-8 list-disc text-error">
              {typeof results.error === "string" ? (
                <li>{results.error}</li>
              ) : (
                results.error.map((err, idx) => <li key={idx}>{err}</li>)
              )}
            </ul>
          </section>
        ) : results.data.length === 0 ? (
          <section className="w-full min-w-0">
            <p className="font-medium">No results found.</p>
          </section>
        ) : (
          <Results results={results.data} />
        )}
      </section>
    </main>
  );
}
