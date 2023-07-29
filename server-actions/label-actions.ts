"use server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { labels, type Label } from "@/db/schema/main";

import { authOptions } from "@/lib/auth";
import type { GenericObj } from "@/lib/types";
import { toSafeId, getOldestAge, didFailMonthConstraint } from "@/lib/utils";
import { LabelFormSchema } from "@/lib/zod/schema";

export async function createLabel(formData: GenericObj) {
  /* Validate input data */
  const schemaRes = LabelFormSchema.safeParse(formData);
  if (!schemaRes.success) {
    console.log(schemaRes.error.errors); // For debugging purposes
    throw new Error(schemaRes.error.errors[0].message);
  }
  const { label } = schemaRes.data;

  /* Validate user is authenticated */
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("User is not authenticated.");
  if (session.user.role === "banned") throw new Error("User is banned.");
  /* Validate user account age */
  const oldestAge = getOldestAge(session.user.linkedAccounts);
  const failedLabelConstraint = didFailMonthConstraint(12, oldestAge);
  if (failedLabelConstraint) {
    throw new Error("User isn't old enough to suggest a label.");
  }

  try {
    await db.insert(labels).values({
      name: toSafeId(label),
      display: label,
      type: "regular",
      userId: session.user.id,
    } as Label);
  } catch (err) {
    throw new Error("Label already exists in database.");
  }

  const labelInDB = await db.query.labels.findFirst({
    where: eq(labels.name, label.toLowerCase()),
    with: {
      user: {
        columns: {
          banReason: false,
        },
      },
    },
  });

  return labelInDB;
}
