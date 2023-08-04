import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { labels, languages, repoLabels, repoLangs } from "@/db/schema/main";

export async function GET() {
  // Get top 3 languages used in repositories indexed
  const topLangs = await db
    .select({
      count: sql<number>`count(*)`,
      name: repoLangs.name,
      display: languages.display,
    })
    .from(repoLangs)
    .groupBy(({ name }) => name)
    .innerJoin(languages, eq(repoLangs.name, languages.name))
    .orderBy((lang) => desc(lang.count))
    .limit(3);

  // Get top 3 labels used in repositories indexed
  const topLabels = await db
    .select({
      count: sql<number>`count(*)`,
      name: repoLabels.name,
      display: labels.display,
    })
    .from(repoLabels)
    .groupBy(({ name }) => name)
    .innerJoin(labels, eq(repoLabels.name, labels.name))
    .orderBy((lb) => desc(lb.count))
    .limit(3);

  return NextResponse.json(
    { top: { languages: topLangs, labels: topLabels } },
    { status: 200 }
  );
}
