import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { FaCrown, FaRobot, FaUserShield } from "react-icons/fa";

import { db } from "@/db";
import { authOptions } from "@/lib/auth";

import { toURLQS } from "@/lib/utils/url";
import { getAccountLink } from "@/app/(main)/_components/utils";
import DataTabs from "./_components/data-tabs";

type Props = { params: { userHandle: string } };

export function generateMetadata({ params }: Props) {
  return { title: `RepoSift | ${decodeURIComponent(params.userHandle)}` };
}

export default async function ProfilePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const decodedHandle = decodeURIComponent(params.userHandle);
  // Check if valid handle
  if (!decodedHandle.startsWith("@")) throw new Error("Invalid handle.");

  const user = await db.query.users.findFirst({
    where: (fields, { eq }) =>
      eq(fields.handleLower, decodedHandle.slice(1).toLowerCase()),
    columns: { id: false, banReason: false },
    with: {
      linkedAccounts: { columns: { id: false, userId: false } },
      contributedLabels: { columns: { type: false, userId: false } },
      contributedRepos: {
        columns: {
          _pk: true,
          id: true,
          type: true,
          author: true,
          name: true,
          description: true,
        },
      },
    },
  });

  if (!user) throw new Error("User doesn't exist.");

  const profileImg = user.linkedAccounts.find(
    (acc) => acc.type === user.imgSrc,
  );

  return (
    <main className="mx-auto grid w-full max-w-appContent gap-4 p-3 py-5 max-md:justify-items-center md:grid-cols-[12rem,auto] md:py-20">
      {/* Profile Image */}
      <Image
        src={profileImg?.image ?? "/assets/default_avatar.png"}
        alt={`@${user.handle}'s profile picture`}
        width={100}
        height={100}
        className="card h-20 w-20 p-0 md:h-48 md:w-48"
      />
      {/* Handle w/ Account Links */}
      <section className="flex w-full min-w-0 flex-col justify-end max-md:items-center max-md:text-center">
        <p className="w-full min-w-0 truncate text-2xl font-semibold md:text-4xl">
          {user.name}
        </p>
        <p className="w-full min-w-0 truncate text-sm font-medium md:text-lg">
          @{user.handle}
        </p>
        {user.role === "bot" && (
          <p className="mt-1 flex w-fit items-center gap-2 rounded-md border border-violet-900 bg-violet-400 px-2 py-0.5 text-sm font-medium">
            <FaRobot /> Bot
          </p>
        )}
        {user.role === "admin" && (
          <p className="mt-1 flex w-fit items-center gap-2 rounded-md border border-cyan-900 bg-teal-400 px-2 py-0.5 text-sm font-medium">
            <FaUserShield /> Admin
          </p>
        )}
        {user.role === "owner" && (
          <p className="mt-1 flex w-fit items-center gap-2 rounded-md border border-amber-900 bg-amber-400 px-2 py-0.5 text-sm font-medium">
            <FaCrown /> Owner
          </p>
        )}

        <div className="mt-2 flex gap-2">
          {user.linkedAccounts.map((acc) => (
            <a
              key={acc.type}
              href={getAccountLink(acc.type, acc.username)}
              target="_blank"
              className="reverse-btn flex items-center rounded-md p-1"
            >
              <Image
                src={
                  acc.type === "github"
                    ? `/assets/icons/github.svg`
                    : `/assets/icons/${acc.type}-colored.svg`
                }
                alt=""
                height={64}
                width={64}
                className="pointer-events-none h-6 w-6 md:h-9 md:w-9"
              />
            </a>
          ))}
        </div>
      </section>
      {/* Contribution Summary */}
      <section className="grid h-fit grid-cols-2 gap-x-2 text-center font-medium">
        <p className="col-span-2 text-sm font-semibold md:text-start">
          Contributed
        </p>
        <div className="card flex flex-col justify-center rounded-md border-2 bg-sky-300 p-1">
          <p className="text-lg font-semibold md:text-2xl">
            {user.contributedRepos.length}
          </p>
          <p className="truncate text-xs">Repositories</p>
        </div>
        <div className="card flex flex-col justify-center rounded-md border-2 bg-green-300 p-1">
          <p className="text-lg font-semibold md:text-2xl">
            {user.contributedLabels.length}
          </p>
          <p className="text-xs">Labels</p>
        </div>
        {session && (
          <Link
            href={`/report?${toURLQS({
              title: `[User Report] @${user.handle}`,
            })}`}
            className="reverse-btn col-span-2 mt-2 !w-full rounded-md border-l-2 bg-red-300 px-0.5 py-1 hover:bg-red-400"
          >
            Report User
          </Link>
        )}
      </section>
      {/* Contribution List */}
      <DataTabs
        labels={user.contributedLabels}
        repositories={user.contributedRepos}
      />
    </main>
  );
}
