"use server";
import { getServerSession } from "next-auth";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { linkedAccounts, type SelectLinkedAcc } from "@/db/schema/next-auth";
import { authOptions } from "@/lib/auth";

import { ENV } from "@/lib/env-server";
import type { ErrorObj, SuccessObj } from "@/lib/types";
import { containsSAErr, extractSAErr } from "@/lib/utils/error";
import { isNotOneWeekOld } from "@/lib/utils/validation";
import { GitHubRepoOwner } from "@/lib/zod/schema";

/**
 * @description Refreshes linked account data if they've been last updated
 *  more than 1 week ago.
 */
export async function refreshLinkedAccs(): Promise<
  ErrorObj | SuccessObj<null>
> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  const { user } = session;

  const errors: string[] = [];
  for (const acc of user.linkedAccounts) {
    const refreshRes = await (acc.type === "github"
      ? refreshGitHubAcc(acc)
      : Promise.resolve({
          error: `Account refresh for the ${acc.type} provider hasn't been implemented.`,
        }));

    if (containsSAErr(refreshRes)) errors.push(...extractSAErr(refreshRes));
  }

  if (errors.length !== 0) return { error: errors };
  return { data: null };
}

async function refreshGitHubAcc(
  acc: SelectLinkedAcc,
): Promise<ErrorObj | SuccessObj<null>> {
  if (isNotOneWeekOld(acc.lastUpdated)) return { data: null };

  // Fetch user data from GitHub API
  try {
    const res = await fetch(`https://api.github.com/user/${acc.id}`, {
      headers: {
        accept: "application/json",
        authorization: `Basic ${btoa(`${ENV.GITHUB_ID}:${ENV.GITHUB_SECRET}`)}`,
        "user-agent": "repo-sift-server",
      },
    });
    const data: unknown = await res.json();
    const dataParsed = GitHubRepoOwner.safeParse(data);
    if (!dataParsed.success) {
      return { error: "Received data of an unexpected form from GitHub." };
    }
    const { login, avatar_url } = dataParsed.data;

    await db
      .update(linkedAccounts)
      .set({ username: login, image: avatar_url, lastUpdated: new Date() })
      .where(
        and(
          eq(linkedAccounts.type, "github"),
          eq(linkedAccounts.userId, acc.userId),
        ),
      );

    return { data: null };
  } catch (err) {
    return { error: "Something unexpected happened." };
  }
}
