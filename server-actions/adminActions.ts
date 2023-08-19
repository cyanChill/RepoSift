"use server";
import { getServerSession } from "next-auth";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db";
import {
  labels,
  logs,
  repoLabels,
  repoLangs,
  reports,
  repositories,
} from "@/db/schema/main";
import { users } from "@/db/schema/next-auth";
import type { UserWithLinkedAccounts } from "@/db/schema/next-auth";
import { authOptions } from "@/lib/auth";

import type { ErrorObj, GenericObj, SuccessObj } from "@/lib/types";
import { containsSAErr, getZodMsg } from "@/lib/utils/error";
import { toSafeId } from "@/lib/utils/mutate";
import { updatedRepoInfo } from "./schema";

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
      // Log the person who enacted this action
      await tx.insert(logs).values({
        id: createId(),
        action: `Updated user. - (${userId})`,
        userId: user.id,
      });
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
      // Log the person who enacted this action
      await tx.insert(logs).values({
        id: createId(),
        action: `Updated label. - \"${labelName}\" -> \"${toSafeId(newName)}\"`,
        userId: user.id,
      });
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
      // Log the person who enacted this action
      await tx.insert(logs).values({
        id: createId(),
        action: `Deleted label. - (${labelName})`,
        userId: user.id,
      });
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to delete label." };
  }
}

export async function updateRepository(
  _repoPK: string,
  formData: GenericObj,
): Promise<ErrorObj | SuccessObj<null>> {
  if (!_repoPK.trim()) return { error: "You must specify the repository pk." };
  /* Validate input data */
  const schemaRes = updatedRepoInfo.safeParse(formData);
  if (!schemaRes.success) return { error: getZodMsg(schemaRes.error) };
  const { primary_label, labels = [], maintainLink } = schemaRes.data;

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;

  /* Validate primary label exists. */
  const pLabelExist = await db.query.labels.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.type, "primary"), eq(fields.name, primary_label)),
  });
  if (!pLabelExist) return { error: "The primary label doesn't exist." };
  /* Validate all regular labels exists. */
  const lbInDB = await db.query.labels.findMany({
    where: (fields, { and, eq }) =>
      and(eq(fields.type, "regular"), inArray(fields.name, labels)),
  });
  if (lbInDB.length !== labels.length) {
    return { error: "Not all regular labels are valid." };
  }

  try {
    await db.transaction(async (tx) => {
      // Delete old labels
      await tx.delete(repoLabels).where(eq(repoLabels.repoPK, _repoPK));
      // Insert new labels
      const newLbRels = labels.map((lb) => ({ name: lb, repoPK: _repoPK }));
      if (newLbRels.length > 0) await tx.insert(repoLabels).values(newLbRels);
      // Update repository
      await tx
        .update(repositories)
        .set({
          _primaryLabel: primary_label,
          ...(maintainLink ? { maintainLink } : {}),
        })
        .where(eq(repositories._pk, _repoPK));
      // Log the person who enacted this action
      await tx.insert(logs).values({
        id: createId(),
        action: `Updated repository. - ${_repoPK}`,
        userId: user.id,
      });
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to update repository." };
  }
}

export async function deleteRepository(
  _repoPK: string,
): Promise<ErrorObj | SuccessObj<null>> {
  if (!_repoPK.trim()) return { error: "You must specify the repository pk." };

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;

  try {
    await db.transaction(async (tx) => {
      await tx.delete(repoLabels).where(eq(repoLabels.repoPK, _repoPK));
      await tx.delete(repoLangs).where(eq(repoLangs.repoPK, _repoPK));
      await tx.delete(repositories).where(eq(repositories._pk, _repoPK));
      // Log the person who enacted this action
      await tx.insert(logs).values({
        id: createId(),
        action: `Deleted repository. - ${_repoPK}`,
        userId: user.id,
      });
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to delete repository." };
  }
}

export async function completeReports(
  reportIds: string[],
): Promise<ErrorObj | SuccessObj<null>> {
  if (!Array.isArray(reportIds) || reportIds.length === 0) {
    return { error: "You must specify an array of report ids." };
  }

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;

  try {
    await db.transaction(async (tx) => {
      // Get all reports we want to mark as completed
      const updtRpt = await tx.query.reports.findMany({
        where: (fields) => inArray(fields.id, reportIds),
        columns: { id: true, title: true },
      });
      if (updtRpt.length !== reportIds.length) {
        throw new Error("Not all report ids are valid.");
      }

      await tx
        .update(reports)
        .set({ isCompleted: true })
        .where(inArray(reports.id, reportIds));
      // Log the person who enacted this action
      const newReports = updtRpt.map((rpt) => ({
        id: createId(),
        action: `Marked report as completed with title: ${rpt.title}.`,
        reportId: rpt.id,
        userId: user.id,
      }));
      await tx.insert(logs).values(newReports);
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to mark report as completed." };
  }
}

export async function deleteReports(
  reportIds: string[],
): Promise<ErrorObj | SuccessObj<null>> {
  if (!Array.isArray(reportIds) || reportIds.length === 0) {
    return { error: "You must specify an array of report ids." };
  }

  const authRes = await isAdmin();
  if (containsSAErr(authRes)) return authRes;
  const user = authRes.data;
  if (user.role !== "owner") {
    return { error: "You must be an owner to delete a report." };
  }

  try {
    await db.transaction(async (tx) => {
      // Get all reports we want to delete
      const delRpt = await tx.query.reports.findMany({
        where: (fields) => inArray(fields.id, reportIds),
        with: { user: { columns: { id: true, handle: true } } },
      });
      if (delRpt.length !== reportIds.length) {
        throw new Error("Not all report ids are valid.");
      }

      await tx.delete(reports).where(inArray(reports.id, reportIds));
      // Log the person who enacted this action
      const newReports = delRpt.map((rpt) => ({
        id: createId(),
        action: `Deleted report from @${rpt.user.handle} (id: ${rpt.user.id}) as spam with title: ${rpt.title}`,
        userId: user.id,
      }));
      await tx.insert(logs).values(newReports);
    });

    return { data: null };
  } catch (err) {
    console.log(err); // Debugging purposes
    return { error: "Failed to delete report as spam." };
  }
}
