"use server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema/next-auth";
import { authOptions } from "@/lib/auth";

import { getZodMsg } from "@/lib/utils/error";
import { isNotOneWeekOld } from "@/lib/utils/validation";
import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import {
  HandleFormSchema,
  NameFormSchema,
  PicFormSchema,
} from "@/lib/zod/schema";

export async function updateName(
  formData: GenericObj,
): Promise<ErrorObj | SuccessObj<string>> {
  /* Validate input data */
  const schemaRes = NameFormSchema.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const { name } = schemaRes.data;

  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  const { user } = session;

  // Verify user last updated their name 1+ week ago.
  if (isNotOneWeekOld(user.nameUpdatedAt)) {
    return { error: "You have updated your name recently." };
  }

  if (user.name === name) {
    return { error: "Your new name is the same as your old one." };
  }

  await db
    .update(users)
    .set({ name, nameUpdatedAt: new Date() })
    .where(eq(users.id, user.id));

  return {
    data: `Successfully changed name from ${user.name} to ${name}.`,
  };
}

export async function updateHandle(
  formData: GenericObj,
): Promise<ErrorObj | SuccessObj<{ newHandle: string; message: string }>> {
  /* Validate input data */
  const schemaRes = HandleFormSchema.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const { handle } = schemaRes.data;

  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  const { user } = session;

  // Verify user last updated their handle 1+ week ago.
  if (isNotOneWeekOld(user.handleUpdatedAt)) {
    return { error: "You have updated your handle recently." };
  }

  if (user.handleLower === handle.toLowerCase()) {
    return { error: "Your new handle is the same as your old one." };
  }

  const handleUsed = await db.query.users.findFirst({
    where: (fields, { eq }) => eq(fields.handleLower, handle),
  });
  if (handleUsed) {
    return { error: "This handle is already used by someone else." };
  }

  try {
    await db
      .update(users)
      .set({
        handle,
        handleLower: handle.toLowerCase(),
        handleUpdatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return {
      data: {
        newHandle: handle,
        message: `Successfully changed handle from @${user.handle} to @${handle}.`,
      },
    };
  } catch (err) {
    console.log(err); // Incase the handle was used by someone else.
    return {
      error: "Something unexpected occurred when updating your handle.",
    };
  }
}

export async function updatePic(
  formData: GenericObj,
): Promise<ErrorObj | SuccessObj<null>> {
  /* Validate input data */
  const schemaRes = PicFormSchema.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const { profile_pic } = schemaRes.data;

  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  const { user } = session;

  if (user.imgSrc === profile_pic) {
    return {
      error: "Your new profile picture source is the same as your old one.",
    };
  }

  const avaliableSrcs = user.linkedAccounts.map((acc) => acc.type);

  if (!avaliableSrcs.includes(profile_pic)) {
    return {
      error: "You don't have an account linked to that profile picture source.",
    };
  }

  await db
    .update(users)
    .set({ imgSrc: profile_pic })
    .where(eq(users.id, user.id));

  return { data: null };
}
