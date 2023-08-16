"use server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db";
import { reports } from "@/db/schema/main";
import { authOptions } from "@/lib/auth";

import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { getZodMsg } from "@/lib/utils/error";

const InputSchema = z.object({
  title: z
    .string({
      required_error: "A title is required.",
      invalid_type_error: "A title must be a string.",
    })
    .trim()
    .min(1, { message: "A title must be non-empty." })
    .max(100, { message: "A title can be at most 100 characters long." }),
  description: z
    .string({
      required_error: "A description is required.",
      invalid_type_error: "A description must be a string.",
    })
    .trim()
    .min(1, { message: "A description must be non-empty." })
    .max(1000, {
      message: "A description can be at most 1000 characters long.",
    }),
});

export async function createReport(
  formData: GenericObj,
): Promise<ErrorObj | SuccessObj<null>> {
  /* Validate input data */
  const schemaRes = InputSchema.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const { title, description } = schemaRes.data;

  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  const { user } = session;

  await db.insert(reports).values({
    id: createId(),
    title,
    description: JSON.stringify(description),
    userId: user.id,
  });

  return { data: null };
}
