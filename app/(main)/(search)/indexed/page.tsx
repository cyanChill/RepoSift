import { getFilters } from "@/server-actions/cached/get-filters";
import { getIndexedRepos } from "@/server-actions/cached/get-repos";
import type { PageProps } from "@/lib/types";
import { arrayTransform, removeEmptyProperties } from "@/lib/utils/mutate";
import FilterButtons from "./_components/filter-buttons";

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
    </main>
  );
}
