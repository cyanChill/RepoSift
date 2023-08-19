"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GoLink, GoUnlink } from "react-icons/go";
import { toast } from "react-hot-toast";

import type { LinkedAccount } from "@/db/schema/next-auth";
import { refreshLinkedAccs } from "@/server-actions/refreshUser";

import { avaliableProviders } from "@/lib/utils/constants";
import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import type { AuthProviders } from "@/lib/zod/utils";

export function LinkedAccWidget({ account }: { account: LinkedAccount }) {
  const getProvider = (val: AuthProviders) => {
    const res = avaliableProviders.find((prov) => prov.value === val);
    if (res) return res.name;
    throw new Error("Invalid linked account provider.");
  };

  return (
    <article className="card flex items-center gap-2 p-2">
      <Image
        src={
          account.type === "github"
            ? `/assets/icons/github.svg`
            : `/assets/icons/${account.type}-colored.svg`
        }
        alt=""
        height={64}
        width={64}
        className="pointer-events-none h-8 w-8 md:h-12 md:w-12"
      />
      <div className="w-full min-w-0">
        <p className="truncate font-medium md:text-xl">
          {getProvider(account.type)}
        </p>
        <p className="truncate text-sm">{account.username}</p>
      </div>
      <button className="reverse-btn p-1 disabled:shadow-none" disabled>
        <GoLink className="pointer-events-none h-4 w-4 md:h-6 md:w-6" />
      </button>
    </article>
  );
}

/**
 * @description Will refresh the data associated with your linked accounts
 *  in our database to keep your links working as expected.
 */
export function RefreshBtn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function refreshAccData() {
    try {
      const data = await refreshLinkedAccs();
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully refreshed linked account data.");
      router.refresh();
    } catch (err) {
      toastSAErrors(err);
    }
  }

  return (
    <div className="my-4 text-sm">
      <p className="mb-2">
        Is your linked account data not up to date? Click the button below to
        refresh it and keep your associated account links working on your
        profile page.
      </p>
      <button
        onClick={() => startTransition(() => refreshAccData())}
        className="reverse-btn ml-auto block bg-green-400 px-2 py-1 font-medium enabled:hover:bg-green-300"
        disabled={isPending}
      >
        Refresh Data
      </button>
    </div>
  );
}
