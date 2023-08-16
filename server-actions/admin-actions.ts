"use server";
import { getServerSession } from "next-auth";
import { and, eq, notInArray } from "drizzle-orm";

import { db } from "@/db";
import { labels, repoLabels, repoLangs, repositories } from "@/db/schema/main";
import { users } from "@/db/schema/next-auth";
import type { UserWithLinkedAccounts } from "@/db/schema/next-auth";
import { authOptions } from "@/lib/auth";

import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { providersVal } from "@/lib/utils/constants";
import { containsSAErr, getZodMsg } from "@/lib/utils/error";
import { toSafeId } from "@/lib/utils/mutate";
import type { AuthProviders } from "@/lib/zod/utils";
import { UpdateRepoSchema } from "@/lib/zod/schema";

/**
 * @description Determines whether the user calling the server-action is
 *  an "admin" or "owner", if true, return the session user object.
 */
async function isAdmin(): Promise<
  ErrorObj | SuccessObj<UserWithLinkedAccounts>
> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  if (!["admin", "owner"].includes(session.user.role)) {
    return { error: "Invalid permissions." };
  }
  return { data: session.user };
}

export async function updateUser(
  userId: string,
  newRole: string,
  banReason = "",
): Promise<ErrorObj | SuccessObj<null>> {
  if (!userId.trim()) return { error: "You must specify a user." };
  if (newRole !== "banned" && newRole !== "user") {
    return { error: "Invalid new role." };
  }
  if (newRole === "banned" && !banReason.trim()) {
    return {
      error: "You must include a ban reason if you are banning a user.",
    };
  }

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;

  try {
    await db.transaction(async (tx) => {
      await db
        .update(users)
        .set({ role: newRole, banReason: banReason })
        .where(
          and(
            eq(users.id, userId),
            notInArray(users.role, ["bot", "admin", "owner"]),
          ),
        );

      // TODO: Log the person who enacted this action
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to update user." };
  }
}

export async function updateLabel(
  labelName: string,
  newName: string,
): Promise<ErrorObj | SuccessObj<null>> {
  if (!labelName.trim()) return { error: "You must specify a label." };
  if (!newName.trim()) return { error: "You must specify a new label name." };

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;

  try {
    await db.transaction(async (tx) => {
      await db
        .update(labels)
        .set({ name: toSafeId(newName), display: newName.trim() })
        .where(and(eq(labels.name, labelName), eq(labels.type, "regular")));
      await db
        .update(repoLabels)
        .set({ name: toSafeId(newName) })
        .where(eq(repoLabels.name, labelName));

      // TODO: Log the person who enacted this action
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to update label." };
  }
}

export async function deleteLabel(
  labelName: string,
): Promise<ErrorObj | SuccessObj<null>> {
  if (!labelName.trim()) return { error: "You must specify a label." };

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;

  try {
    await db.transaction(async (tx) => {
      await tx.delete(repoLabels).where(eq(repoLabels.name, labelName));
      await tx
        .delete(labels)
        .where(and(eq(labels.name, labelName), eq(labels.type, "regular")));

      // TODO: Log the person who enacted this action
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to delete label." };
  }
}

export async function updateRepository(
  repoId: string,
  formData: GenericObj,
): Promise<ErrorObj | SuccessObj<null>> {
  if (!repoId.trim()) return { error: "You must specify a repository id." };
  /* Validate input data */
  const schemaRes = UpdateRepoSchema.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;

  const { provider, primary_label, labels = [], maintainLink } = schemaRes.data;

  /* Validate primary label exists. */
  const pLabelExist = await db.query.labels.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.type, "primary"), eq(fields.name, primary_label)),
  });
  if (!pLabelExist) return { error: "The primary label doesn't exist." };
  /* Validate all regular labels exists. */
  for (const lb of labels) {
    const labelExist = await db.query.labels.findFirst({
      where: (fields, { and, eq }) =>
        and(eq(fields.type, "regular"), eq(fields.name, lb)),
    });
    if (!labelExist) return { error: "The regular label doesn't exist." };
  }

  try {
    await db.transaction(async (tx) => {
      // Delete old labels
      await tx
        .delete(repoLabels)
        .where(
          and(eq(repoLabels.repoId, repoId), eq(repoLabels.repoType, provider)),
        );
      // Insert new labels
      const newLbRels =
        labels?.map((lb) => ({ name: lb, repoId, repoType: provider })) ?? [];
      if (newLbRels.length > 0) await tx.insert(repoLabels).values(newLbRels);
      // Update repository
      await tx
        .update(repositories)
        .set({
          _primaryLabel: primary_label,
          ...(maintainLink ? { maintainLink } : {}),
        })
        .where(
          and(eq(repositories.id, repoId), eq(repositories.type, provider)),
        );

      // TODO: Log the person who enacted this action
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to update repository." };
  }
}

export async function deleteRepository(
  repoId: string,
  repoType: AuthProviders,
): Promise<ErrorObj | SuccessObj<null>> {
  if (!repoId.trim()) return { error: "You must specify a repository id." };
  if (!providersVal.includes(repoType)) {
    return { error: "Invalid repository type." };
  }

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(repoLabels)
        .where(
          and(eq(repoLabels.repoId, repoId), eq(repoLabels.repoType, repoType)),
        );
      await tx
        .delete(repoLangs)
        .where(
          and(eq(repoLangs.repoId, repoId), eq(repoLangs.repoType, repoType)),
        );
      await tx
        .delete(repositories)
        .where(
          and(eq(repositories.id, repoId), eq(repositories.type, repoType)),
        );

      // TODO: Log the person who enacted this action
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to delete repository." };
  }
}
