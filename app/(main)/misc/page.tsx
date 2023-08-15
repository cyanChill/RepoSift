import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GoLink, GoUnlink } from "react-icons/go";

import { avaliableProviders } from "@/lib/utils/constants";
import { authOptions } from "@/lib/auth";
import type { AuthProviders } from "@/lib/zod/utils";
import { DisplayForm, HandleForm, NameForm } from "./_components/forms";

export const metadata = {
  title: "RepoSift | Misc.",
};

export default async function MiscPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/join?callbackUrl=/misc");
  const { user } = session;

  const getProvider = (val: AuthProviders) => {
    const res = avaliableProviders.find((prov) => prov.value === val);
    if (res) return res.name;
    throw new Error("Invalid linked account provider.");
  };

  const section = "mb-8";
  const sectionHeader = "mb-4 text-2xl font-semibold md:mb-6 md:text-4xl";
  const subSection = "flex flex-col mb-4";
  const subSectionHeader = "mb-2 text-lg font-medium md:text-2xl";
  const subSectionText = "mb-2 text-sm";

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
      {/* Account Settings */}
      <section className={section}>
        <h2 className={sectionHeader}>Account</h2>
        {user.role === "banned" && (
          <div className="text-error">
            <p className="font-medium md:text-lg">
              Account settings are unavaliable because you were banned for:
            </p>
            <p className="text-sm md:text-base">{`"${user.banReason}"`}</p>
          </div>
        )}
        {user.role !== "banned" && (
          <>
            {/* "Personal" Settings */}
            <section className={subSection}>
              <h3 className={subSectionHeader}>Personal</h3>
              <NameForm user={user} />
              <HandleForm user={user} />
            </section>
            {/* "Display" Settings */}
            <section className={subSection}>
              <h3 className={subSectionHeader}>Display</h3>
              <DisplayForm user={user} />
            </section>
            {/* "Linked Accounts" Settings */}
            <section className={subSection}>
              <h3 className={subSectionHeader}>Linked Accounts</h3>
              <div className="flex flex-col gap-4">
                {user.linkedAccounts.map((acc) => (
                  <article
                    key={acc.type}
                    className="card flex items-center gap-2 p-2"
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
                      className="pointer-events-none h-8 w-8 md:h-12 md:w-12"
                    />
                    <div className="w-full min-w-0">
                      <p className="truncate font-medium md:text-xl">
                        {getProvider(acc.type)}
                      </p>
                      <p className="truncate text-sm">{acc.username}</p>
                    </div>
                    <button
                      className="reverse-btn p-1 disabled:shadow-none"
                      disabled
                    >
                      <GoLink className="pointer-events-none h-4 w-4 md:h-6 md:w-6" />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </section>

      {/* Support Section */}
      <section className={section}>
        <h2 className={sectionHeader}>Support</h2>
        <section className={subSection}>
          <h3 className={subSectionHeader}>Report</h3>
          <p className={subSectionText}>
            Send a report about any bugs, incorrect information, suggestions, or
            fixes you may have and we&apos;ll look at it as soon as possible.
          </p>
          <Link
            href="/report"
            className="reverse-btn self-end bg-blue-300 py-1 font-medium hover:bg-blue-400"
          >
            Send a Report
          </Link>
        </section>
      </section>
    </main>
  );
}
