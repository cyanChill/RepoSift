import { getServerSession } from "next-auth";

import type { UserWLinkedAccs } from "@/db/schema/next-auth";

import { authOptions } from "@/lib/auth";
import { didFailMonthConstraint } from "@/lib/utils/validation";
import { getOldestAge } from "@/lib/utils/mutate";
import type { ErrorObj, SuccessObj } from "@/lib/types";

/**
 * @description Checks whether a user is authenticated & account is of required age.
 * @param minAccAge A postive integer representing the number of months required.
 * @param errMsg An error message if the user doesn't satisfy the age constraint.
 * @returns An object with an error or an object with the user data.
 */
export async function checkAuthConstraint(
  minAccAge = 0,
  errMsg: string,
): Promise<ErrorObj | SuccessObj<UserWLinkedAccs>> {
  // Validate user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) return { error: "User is not authenticated." };
  if (session.user.role === "banned") return { error: "User is banned." };
  // Validate user account age
  const oldestAge = getOldestAge(session.user.linkedAccounts);
  const failedRepoConstraint = didFailMonthConstraint(minAccAge, oldestAge);
  if (failedRepoConstraint) return { error: errMsg };
  return { data: session.user };
}
