import { cache } from "react";

import { db } from "@/db";
import { languages } from "@/db/schema/main";

import type { Option } from "@/components/form/utils";

type Labels = {
  primary: Option[];
  regular: Option[];
};

export const revalidate = 900; // Revalidate data at most every 15 minutes

/**
 * @description Fetch filters from database and caches it for 15 minutes.
 * @returns An object.
 */
export const getFilters = cache(async () => {
  const allLabels = await db.query.labels.findMany({
    columns: { userId: false },
  });
  const labels: Labels = { primary: [], regular: [] };
  allLabels.forEach((lb) => {
    if (lb.type === "primary") {
      labels.primary.push({ name: lb.display, value: lb.name });
    } else {
      labels.regular.push({ name: lb.display, value: lb.name });
    }
  });

  const allLangs = await db
    .select({ name: languages.display, value: languages.name })
    .from(languages);

  return { labels, languages: allLangs };
});
