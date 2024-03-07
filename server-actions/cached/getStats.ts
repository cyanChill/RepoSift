import { cache } from "react";
import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { labels, languages, repoLabels, repoLangs } from "@/db/schema/main";

type SQLResult = { name: string; display: string; count: string }[];

export const revalidate = 86400; // Revalidate data at most once a day

/**
 * @description Fetch top stats from database and caches it for 1 day.
 * @returns An object.
 */
export const getStats = cache(async () => {
  // FIXME: Work around for `error: column "labels.display" must appear in the GROUP BY clause or be used in an aggregate function`
  //  - Fix: https://stackoverflow.com/a/19602031

  // Get top 3 languages used in repositories indexed
  const topLangsSQL = await db.execute(
    sql`select m.name, m.display, t.count from (SELECT name, count(name) as count FROM ${repoLangs} GROUP BY name) t JOIN ${languages} m ON m.name = t.name ORDER BY t.count DESC LIMIT 3`,
  );

  // const topLangs = await db
  //   .select({
  //     count: sql<number>`count(*)`,
  //     name: repoLangs.name,
  //     display: languages.display,
  //   })
  //   .from(repoLangs)
  //   .groupBy(({ name }) => name)
  //   .innerJoin(languages, eq(repoLangs.name, languages.name))
  //   .orderBy((lang) => desc(lang.count))
  //   .limit(3);

  // Get top 3 labels used in repositories indexed
  const topLabelsSQL = await db.execute(
    sql`select m.name, m.display, t.count from (SELECT name, count(name) as count FROM ${repoLabels} GROUP BY name) t JOIN ${labels} m ON m.name = t.name ORDER BY t.count DESC LIMIT 3`,
  );

  // const topLabels = await db
  //   .select({
  //     count: sql<number>`count(*)`,
  //     name: repoLabels.name,
  //     display: labels.display,
  //   })
  //   .from(repoLabels)
  //   .groupBy(({ name }) => name)
  //   .innerJoin(labels, eq(repoLabels.name, labels.name))
  //   .orderBy((lb) => desc(lb.count))
  //   .limit(3);

  return {
    languages: topLangsSQL.rows as SQLResult,
    labels: topLabelsSQL.rows as SQLResult,
  };
});
