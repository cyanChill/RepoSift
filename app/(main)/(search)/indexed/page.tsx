import { getFilters } from "@/server-actions/cached/getFilters";
import { doIndexedSearch } from "@/server-actions/cached/doIndexedSearch";

import type { PageProps } from "@/lib/types";
import { containsSAErr } from "@/lib/utils/error";
import { arrayTransform, removeEmptyProperties } from "@/lib/utils/mutate";
import FilterButtons from "./_components/filter-buttons";
import Results from "./_components/results";
import Pagination from "@/components/form/pagination";

export const metadata = {
  title: "RepoSift | Indexed Search",
};

export default async function IndexedSearchPage({ searchParams }: PageProps) {
  const { labels, languages } = await getFilters();
  const { providers, languages: langs, labels: lbs, ...rest } = searchParams;

  const transformedSearchParams = removeEmptyProperties({
    providers: providers ? arrayTransform(providers as string) : undefined,
    languages: langs ? arrayTransform(langs as string) : undefined,
    labels: lbs ? arrayTransform(lbs as string) : undefined,
    ...rest,
  });

  const results = await doIndexedSearch(transformedSearchParams);

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
        ) : results.data.items.length === 0 ? (
          <section className="w-full min-w-0">
            <p className="font-medium">No results found.</p>
          </section>
        ) : (
          <Results results={results.data.items} />
        )}
      </section>

      {/* Pagination Component */}
      <div className="mt-4 md:max-w-[50%]">
        {!containsSAErr(results) && results.data.items.length > 0 && (
          <Pagination
            currPage={results.data.currPage}
            hasNext={results.data.hasNext}
          />
        )}
      </div>
    </main>
  );
}
