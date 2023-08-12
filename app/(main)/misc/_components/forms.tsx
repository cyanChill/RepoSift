"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { addDays } from "date-fns";
import { TfiSave } from "react-icons/tfi";
import { toast } from "react-hot-toast";

import type { UserWithLinkedAccounts } from "@/db/schema/next-auth";

import {
  updateHandle,
  updateName,
  updatePic,
} from "@/server-actions/profile-actions";
import type { GenericObj } from "@/lib/types";
import { LIMITS, PATTERNS, avaliableProviders } from "@/lib/utils/constants";
import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import { cleanDate, formDataToObj } from "@/lib/utils/mutate";
import { isNotOneWeekOld } from "@/lib/utils/validation";
import type { AuthProviders } from "@/lib/zod/utils";
import { Select } from "@/components/form/input";

type Props = {
  user: UserWithLinkedAccounts;
};

export function NameForm({ user }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState(user.name);

  if (isNotOneWeekOld(user.nameUpdatedAt)) {
    return (
      <RecentField
        label="Name"
        value={user.name}
        lastUpdated={cleanDate(addDays(user.nameUpdatedAt, 7))}
      />
    );
  }

  async function onSubmit(formData: FormData) {
    const cleanedData = formDataToObj(formData) as GenericObj;
    try {
      const data = await updateName(cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success(data.data);
      router.refresh();
    } catch (err) {
      toastSAErrors(err);
    }
  }

  return (
    <form
      action={(data) => startTransition(() => onSubmit(data))}
      className="mb-4 flex flex-col"
    >
      <label htmlFor="name" className="form-label">
        Name
      </label>
      <fieldset className="flex" disabled={isPending}>
        <input
          id="name"
          name="name"
          minLength={3}
          maxLength={LIMITS.NAME}
          pattern={PATTERNS.NAME}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="form-input w-full border-r-0"
          required
        />
        <button
          type="submit"
          className="form-input h-10 w-10 bg-yellow-400 px-2.5 enabled:hover:bg-yellow-300"
          disabled={newName === user.name}
        >
          <TfiSave className="pointer-events-none" />
        </button>
      </fieldset>
      <p className="mt-2 text-xs sm:text-sm">
        Must be <span className="font-semibold">3-50 characters</span> long.{" "}
        <span className="font-semibold">Can be updated once a week.</span>
      </p>
    </form>
  );
}

export function HandleForm({ user }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [newHandle, setNewHandle] = useState(user.handle);

  if (isNotOneWeekOld(user.handleUpdatedAt)) {
    return (
      <RecentField
        label="Handle"
        value={user.handle}
        withAt={true}
        lastUpdated={cleanDate(addDays(user.handleUpdatedAt, 7))}
      />
    );
  }

  async function onSubmit(formData: FormData) {
    const cleanedData = formDataToObj(formData) as GenericObj;
    try {
      const data = await updateHandle(cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      await update({ handle: data.data.newHandle });
      toast.success(data.data.message);
      router.refresh();
    } catch (err) {
      toastSAErrors(err);
    }
  }

  return (
    <form
      action={(data) => startTransition(() => onSubmit(data))}
      className="mb-4 flex flex-col"
    >
      <label htmlFor="handle" className="form-label">
        Handle
      </label>
      <fieldset className="flex" disabled={isPending}>
        <p className="card h-10 w-10 border-2 border-r-0 bg-black p-1 text-center font-semibold text-white md:text-lg">
          @
        </p>
        <input
          id="handle"
          name="handle"
          minLength={4}
          maxLength={LIMITS.HANDLE}
          pattern={PATTERNS.HANDLE}
          value={newHandle}
          onChange={(e) => setNewHandle(e.target.value)}
          className="form-input w-full border-r-0"
          required
        />
        <button
          type="submit"
          className="form-input h-10 w-10 bg-yellow-400 px-2.5 enabled:hover:bg-yellow-300"
          disabled={newHandle === user.handle}
        >
          <TfiSave className="pointer-events-none" />
        </button>
      </fieldset>
      <p className="mt-2 text-xs sm:text-sm">
        Can only contain{" "}
        <span className="font-semibold">alphanumeric characters</span> (letters
        A-Z, numbers 0-9) & <span className="font-semibold">underscores</span>{" "}
        and be <span className="font-semibold">4-30 characters</span> long.{" "}
        <span className="font-semibold">Can be updated once a week.</span>
      </p>
    </form>
  );
}

export function DisplayForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    const cleanedData = formDataToObj(formData) as GenericObj;
    try {
      const data = await updatePic(cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully updated profile picture.");
    } catch (err) {
      toastSAErrors(err);
    }
  }

  const usedProviders = user.linkedAccounts.map((acc) => acc.type);
  const opts = avaliableProviders.map((opt) => {
    if (usedProviders.includes(opt.value as AuthProviders)) {
      return { name: opt.name, value: opt.value };
    } else {
      return { ...opt, disabled: true };
    }
  });

  const initVal = opts.find((opt) => opt.value === user.imgSrc);

  return (
    <form action={(data) => startTransition(() => onSubmit(data))}>
      <fieldset
        className="mb-4 flex flex-col"
        disabled={isPending || usedProviders.length === 1}
      >
        <Select
          name="profile_pic"
          label="Profile Picture"
          options={opts}
          initialValue={initVal}
        />
        <button
          type="submit"
          className="reverse-btn self-end bg-yellow-400 py-0.5 font-medium hover:bg-yellow-300 disabled:bg-gray-200 disabled:shadow-none md:text-lg"
        >
          Update
        </button>
      </fieldset>
    </form>
  );
}

type RecentFieldProps = {
  label: string;
  value: string;
  lastUpdated: string;
  withAt?: boolean;
};

const RecentField = ({
  label,
  value,
  lastUpdated,
  withAt = false,
}: RecentFieldProps) => {
  return (
    <div className="mb-4 flex flex-col">
      <p className="form-label">{label}</p>
      <div className="flex">
        {withAt && (
          <p className="card h-10 w-10 border-2 border-r-0 bg-black p-1 text-center font-semibold text-white md:text-lg">
            @
          </p>
        )}
        <p className="form-input w-full bg-gray-200 text-opacity-75">{value}</p>
      </div>
      <p className="mt-2 text-xs sm:text-sm">
        {label} was updated recently and can be updated on{" "}
        <span className="font-semibold">{lastUpdated}</span>.
      </p>
    </div>
  );
};
