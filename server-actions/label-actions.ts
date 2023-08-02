"use server";
import { db } from "@/db";
import { labels, type Label } from "@/db/schema/main";

import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { containsSAErr, getZodMsg } from "@/lib/utils/error";
import { toSafeId } from "@/lib/utils/mutate";
import { LabelFormSchema } from "@/lib/zod/schema";
import { checkAuthConstraint } from "./utils";

export async function createLabel(
  formData: GenericObj
): Promise<ErrorObj | SuccessObj<Omit<Label, "userId">>> {
  /* Validate input data */
  const schemaRes = LabelFormSchema.safeParse(formData);
  if (!schemaRes.success) {
    console.log(schemaRes.error.errors); // For debugging purposes
    return { error: getZodMsg(schemaRes.error) };
  }
  const { label } = schemaRes.data;

  const authRes = await checkAuthConstraint(
    12,
    "User isn't old enough to suggest a label."
  );
  if (containsSAErr(authRes)) return authRes;

  try {
    await db.insert(labels).values({
      name: toSafeId(label),
      display: label,
      type: "regular",
      userId: authRes.data.id,
    } as Label);
  } catch (err) {
    return { error: "Label already exists in database." };
  }

  const labelInDB = await db.query.labels.findFirst({
    where: (fields, { eq }) => eq(fields.name, toSafeId(label)),
    columns: { userId: false },
  });
  if (!labelInDB) return { error: "Failed to insert label." };

  return { data: labelInDB };
}
