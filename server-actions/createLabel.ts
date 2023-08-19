"use server";
import { db } from "@/db";
import { labels } from "@/db/schema/main";

import type { ErrorObj, SuccessObj } from "@/lib/types";
import { containsSAErr, getZodMsg } from "@/lib/utils/error";
import { toSafeId } from "@/lib/utils/mutate";
import { checkAuthConstraint } from "./utils";
import { contributeLabel } from "./schema";

export async function createLabel(
  _newLabel: string,
): Promise<ErrorObj | SuccessObj<null>> {
  /* Validate input data */
  const schemaRes = contributeLabel.safeParse(_newLabel);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const label = schemaRes.data;

  const authRes = await checkAuthConstraint(
    12,
    "User isn't old enough to suggest a label.",
  );
  if (containsSAErr(authRes)) return authRes;

  try {
    await db.insert(labels).values({
      name: toSafeId(label),
      display: label,
      userId: authRes.data.id,
    });

    return { data: null };
  } catch (err) {
    return { error: "Failed to create label, it may already exists." };
  }
}
