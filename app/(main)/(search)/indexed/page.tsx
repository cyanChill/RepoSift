import { getFilters } from "@/server-actions/cached/get-filters";
import FilterButtons from "./_components/filter-buttons";

export default async function IndexedSearchPage() {
  const { labels, languages } = await getFilters();

  return (
    <main className="mx-auto w-full max-w-appContent p-3 py-5 md:py-20">
      <FilterButtons labels={labels} languages={languages} />
    </main>
  );
}
