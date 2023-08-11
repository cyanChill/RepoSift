"use client";
import { addDays, isBefore, subWeeks } from "date-fns";
import { TfiSave } from "react-icons/tfi";

import type { UserWithLinkedAccounts } from "@/db/schema/next-auth";

import { LIMITS, PATTERNS, avaliableProviders } from "@/lib/utils/constants";
import { cleanDate } from "@/lib/utils/mutate";
import type { AuthProviders } from "@/lib/zod/utils";
import { Select } from "@/components/form/input";

type Props = {
  user: UserWithLinkedAccounts;
};

/*
  TODO: The server actions on submission will do a "revalidate" / hard refresh the page.
*/

export function NameForm({ user }: Props) {
  return (
    <form className="mb-4 flex flex-col">
      <label htmlFor="name" className="form-label">
        Name
      </label>
      <fieldset className="flex">
        <input
          id="name"
          name="name"
          minLength={3}
          maxLength={LIMITS.NAME}
          pattern={PATTERNS.NAME}
          className="form-input w-full border-r-0"
          defaultValue={user.name}
          required
        />
        <button
          type="submit"
          className="form-input h-10 w-10 bg-yellow-400 px-2.5 hover:bg-yellow-300"
        >
          <TfiSave className="pointer-events-none" />
        </button>
      </fieldset>
      <p className="mt-2 text-xs sm:text-sm">
        Must be <span className="font-semibold">3-50 characters</span> long.
      </p>
    </form>
  );
}

export function HandleForm({ user }: Props) {
  if (!isBefore(user.handleUpdatedAt, subWeeks(Date.now(), 1))) {
    return (
      <div className="mb-4 flex flex-col">
        <p className="form-label">Handle</p>
        <div className="flex">
          <p className="card h-10 w-10 border-2 border-r-0 bg-black p-1 text-center font-semibold text-white md:text-lg">
            @
          </p>
          <p className="form-input w-full bg-gray-200 text-opacity-75">
            {user.handle}
          </p>
        </div>
        <p className="mt-2 text-xs sm:text-sm">
          Handle was updated recently and can be updated on{" "}
          <span className="font-semibold">
            {cleanDate(addDays(user.handleUpdatedAt, 7))}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="mb-4 flex flex-col">
      <label htmlFor="handle" className="form-label">
        Handle
      </label>
      <fieldset className="flex">
        <p className="card h-10 w-10 border-2 border-r-0 bg-black p-1 text-center font-semibold text-white md:text-lg">
          @
        </p>
        <input
          id="handle"
          name="handle"
          minLength={4}
          maxLength={LIMITS.HANDLE}
          pattern={PATTERNS.HANDLE}
          className="form-input w-full border-r-0"
          defaultValue={user.handle}
          required
        />
        <button
          type="submit"
          className="form-input h-10 w-10 bg-yellow-400 px-2.5 hover:bg-yellow-300"
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
    <form>
      <fieldset
        disabled={usedProviders.length === 1}
        className="mb-4 flex flex-col"
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
