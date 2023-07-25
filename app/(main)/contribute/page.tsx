import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { IconType } from "react-icons/lib";
import { IoPricetags } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";

import { authOptions } from "@/lib/auth";
import {
  cn,
  getOldestAge,
  getMonthDescriptor,
  didFailMonthConstraint,
} from "@/lib/utils";

export const metadata = {
  title: "RepoSift | Contribute",
};

export default async function ContributePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/join?callbackUrl=/contribute");
  }

  // Get the date from the oldest account amongst the linked accounts
  const oldestAge = getOldestAge(session.user.linkedAccounts);

  return (
    <>
      <ContributeType
        href="/contribute/repository"
        Icon={SiBookstack}
        title="Index a Repository"
        description="Help create a library of better labeled repositories to help users better find what they're looking for."
        btnText="Start Indexing"
        bgClr={{ icon: "bg-red-500", button: "bg-green-400" }}
        oldestAge={oldestAge}
        constraint={3}
      />
      <ContributeType
        href="/contribute/label"
        Icon={IoPricetags}
        title="Suggest a Label"
        description="Help others index repositories better by creating labels that can be tailored to the interest of others."
        btnText="Suggest a Label"
        bgClr={{ icon: "bg-sky-300", button: "bg-yellow-400" }}
        oldestAge={oldestAge}
        constraint={12}
      />
    </>
  );
}

type ContributeType = {
  href: string;
  Icon: IconType;
  title: string;
  description: string;
  btnText: string;
  bgClr: { icon: string; button: string };
  oldestAge: Date;
  constraint: number; // Number of months required
};

const ContributeType = ({
  href,
  Icon,
  title,
  description,
  btnText,
  bgClr,
  oldestAge,
  constraint,
}: ContributeType) => {
  // Constraint is failed if "oldestAge" > "Today - Constraint"
  const disabled = didFailMonthConstraint(constraint, oldestAge);

  return (
    <section className="just-black flex w-full flex-col border-2 bg-white p-4 shadow-full md:h-[500px] md:max-w-[425px] md:p-6 md:pb-12">
      <Icon
        className={cn(
          "just-black h-auto w-12 border-2 p-2 shadow-full md:w-20",
          bgClr.icon,
          { "bg-gray-200": disabled }
        )}
      />

      <h2 className="mt-4 text-lg font-semibold md:mt-8 md:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm md:mt-4 md:text-lg">{description}</p>

      {disabled && (
        <p className="mt-4 text-xs italic text-red-500 md:mt-8 md:text-base">
          This option is disabled for you due to not having the required
          developer account age (
          <span className="font-semibold">
            greater than {getMonthDescriptor(constraint)}
          </span>
          ).
        </p>
      )}

      <Link
        href={href}
        className={cn(
          "just-black mt-6 w-fit self-center border-2 px-6 py-2 text-center font-medium md:mt-auto md:px-12 md:text-lg",
          bgClr.button,
          {
            "pointer-events-none bg-gray-200": disabled,
            "shadow-full transition duration-300 hover:shadow-none": !disabled,
          }
        )}
      >
        {btnText}
      </Link>
    </section>
  );
};
