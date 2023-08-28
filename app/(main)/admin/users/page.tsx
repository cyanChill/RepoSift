import Image from "next/image";

import { db } from "@/db";
import type { UserWLinkedAccs } from "@/db/schema/next-auth";

import type { PageProps } from "@/lib/types";
import { firstStrParam } from "@/lib/utils/url";
import { BaseForm, ManageUserForm } from "../_components/forms";

export const metadata = {
  title: "RepoSift | Manage Users",
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const { handle: unsafeHandle } = searchParams;
  const handle = firstStrParam(unsafeHandle);

  let user: UserWLinkedAccs | undefined;
  let profileImg: string | undefined;
  if (handle) {
    user = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.handleLower, handle),
      with: { linkedAccounts: true },
    });
  }

  if (user) {
    const imgAcc = user.linkedAccounts.find((acc) => acc.type === user!.imgSrc);
    if (imgAcc) profileImg = imgAcc.image ?? undefined;
  }

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
      <p className="md:text-lg">
        In this menu, you can search for users by their handle and do the
        following:
      </p>
      <ul className="mb-4 ml-8 list-disc text-sm md:mb-8 md:text-base">
        <li>
          Update the role of non-RepoSift affiliated accounts to either have the{" "}
          {`"user"`} or {`"banned"`} role.
        </li>
        <li>
          You {"can't"} update the roles of users of RepoSift with the {`"bot"`}
          , {`"admin"`}, or {`"owner"`} roles.
        </li>
      </ul>
      <hr className="my-4 h-px border-0 bg-black md:my-8" />

      <BaseForm
        variant="users"
        fieldName="handle"
        placeholder="Enter user handle to get started"
        initVal={handle}
      />

      {handle && !user && (
        <p className="px-2  font-medium text-error">Error: User not found.</p>
      )}

      {user && (
        <section className="mt-8 flex flex-col gap-4 px-2">
          <div className="flex gap-4">
            <Image
              src={profileImg ?? "/assets/default_avatar.png"}
              alt={`@${user.handle}'s profile picture`}
              width={100}
              height={100}
              className="card h-20 w-20 p-0"
            />
            <div className="flex w-full min-w-0 flex-col justify-end">
              <p className="w-full min-w-0 truncate text-2xl font-semibold md:text-4xl">
                {user.name}
              </p>
              <p className="w-full min-w-0 truncate text-sm font-medium md:text-lg">
                @{user.handle}
              </p>
            </div>
          </div>

          {/* Info for non-RepoSift affiliated accounts */}
          {["banned", "user"].includes(user.role) && (
            <ManageUserForm user={user} />
          )}
          {/* Info for RepoSift affiliated accounts */}
          {!["banned", "user"].includes(user.role) && (
            <div className="col-span-2">
              <p className="form-label">Role</p>
              <p className="form-input bg-gray-200 text-opacity-75">
                {user.role}
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
