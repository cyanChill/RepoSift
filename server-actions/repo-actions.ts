"use server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { labels, type Label } from "@/db/schema/main";

import { authOptions } from "@/lib/auth";
import type { GenericObj } from "@/lib/types";
import { toSafeId, getOldestAge, didFailMonthConstraint } from "@/lib/utils";
import { RepoFormSchema } from "@/lib/zod/schema";

export async function createRepository(formData: GenericObj) {
  /* Validate input data */
  const schemaRes = RepoFormSchema.safeParse(formData);
  if (!schemaRes.success) {
    console.log(schemaRes.error.errors); // For debugging purposes
    return { error: schemaRes.error.errors[0].message };
  }
  const { author, name, primary_label, provider, labels } = schemaRes.data;
  console.log(schemaRes.data);

  /* Validate user is authenticated */
  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  if (session.user.role === "banned") return { error: "User is banned." };
  /* Validate user account age */
  const oldestAge = getOldestAge(session.user.linkedAccounts);
  const failedRepoConstraint = didFailMonthConstraint(3, oldestAge);
  if (failedRepoConstraint) {
    return { error: "User isn't old enough to index a repository." };
  }

  return { error: "Feature not implemented." };
}
