"use server";
import { getServerSession } from "next-auth";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db";
import { reports } from "@/db/schema/main";
import { authOptions } from "@/lib/auth";

import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { getZodMsg } from "@/lib/utils/error";
import { newReport } from "./schema";

export async function createReport(
  formData: GenericObj,
): Promise<ErrorObj | SuccessObj<null>> {
  /* Validate input data */
  const schemaRes = newReport.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const { title, description } = schemaRes.data;

  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  const { user } = session;

  try {
    await db.insert(reports).values({
      id: createId(),
      title,
      description: JSON.stringify(description),
      userId: user.id,
    });

    return { data: null };
  } catch (err) {
    return { error: "Failed to submit report." };
  }
}
