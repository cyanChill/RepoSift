"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LuFolderSearch } from "react-icons/lu";
import { toast } from "react-hot-toast";

import type { UserWithLinkedAccounts } from "@/db/schema/next-auth";
import type { LabelWithUser, Repository } from "@/db/schema/main";
import {
  deleteLabel,
  deleteRepository,
  updateLabel,
  updateRepository,
  updateUser,
} from "@/server-actions/admin-actions";

import { cn } from "@/lib/utils";
import type { GenericObj } from "@/lib/types";
import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import { formDataToObj } from "@/lib/utils/mutate";
import { toURLQS } from "@/lib/utils/url";
import { Input, Select } from "@/components/form/input";
import type { Option } from "@/components/form/utils";
import { MultiSearchSelect, SearchSelect } from "@/components/form/custom";

type BaseFormProps = {
  variant: "users" | "labels" | "repositories";
  fieldName: string;
  placeholder: string;
  initVal?: string;
};

/**
 * @description Reusable form to handle search for Admin management
 */
export function BaseForm({
  variant,
  placeholder,
  fieldName,
  initVal,
}: BaseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initVal ?? "");

  function onSubmit(formData: FormData) {
    const cleanedData = formDataToObj(formData) as Record<string, string>;
    router.push(`/admin/${variant}?${toURLQS(cleanedData)}`);
  }

  useEffect(() => {
    setQuery(initVal ?? "");
  }, [initVal]);

  return (
    <form
      action={(data) => startTransition(() => onSubmit(data))}
      className="mb-4 flex flex-col"
    >
      <label htmlFor={`admin-${variant}`} />
      <fieldset className="flex" disabled={isPending}>
        <input
          id={`admin-${variant}`}
          name={fieldName}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="form-input w-full border-r-0"
          required
        />
        <button
          type="submit"
          className="form-input h-10 w-10 bg-yellow-400 px-2.5 enabled:hover:bg-yellow-300"
        >
          <LuFolderSearch className="pointer-events-none" />
        </button>
      </fieldset>
    </form>
  );
}

const ROLEOPTS = [
  { name: "User", value: "user" },
  { name: "Banned", value: "banned" },
];

/**
 * @description Gives the ability to update a non-RepoSift affiliated
 *  account's role (between "user" and "banned") along with giving a ban
 *  reason.
 */
export function ManageUserForm({ user }: { user: UserWithLinkedAccounts }) {
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    const newRole = formData.get("role") as string;
    const newBanReason = formData.get("ban_reason") as string;
    try {
      const data = await updateUser(
        user.id,
        newRole ?? user.role,
        newBanReason ?? user.banReason,
      );
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully updated user role.");
    } catch (err) {
      toastSAErrors(err);
    }
  }
  const initRole = ROLEOPTS.find((role) => user.role === role.value);

  return (
    <form action={(data) => startTransition(() => onSubmit(data))}>
      <fieldset className="flex flex-col" disabled={isPending}>
        <Select
          name="role"
          label="Role"
          options={ROLEOPTS}
          initialValue={initRole}
        />
        <Input
          name="ban_reason"
          label="Ban Reason"
          type="text"
          defaultValue={user.banReason ?? ""}
        />
        <button
          type="submit"
          className="reverse-btn self-end bg-purple-400 py-1 font-medium enabled:hover:bg-purple-300"
        >
          Update User
        </button>
      </fieldset>
    </form>
  );
}

/**
 * @description Gives the ability to update the name of a "regular"
 *  label and delete a "regular" label.
 */
export function ManageLabelForm({ label }: { label: LabelWithUser }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function onSubmit(formData: FormData) {
    const updtName = formData.get("label") as string;
    try {
      const data = await updateLabel(label.name, updtName ?? "");
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully updated label.");
      router.push(`/admin/labels?label=${updtName}`);
    } catch (err) {
      toastSAErrors(err);
    }
  }

  async function onDelete() {
    if (!confirmDelete) return;
    try {
      const data = await deleteLabel(label.name);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully deleted label.");
      router.refresh();
    } catch (err) {
      toastSAErrors(err);
    }
  }

  return (
    <form action={(data) => startTransition(() => onSubmit(data))}>
      <fieldset className="flex flex-col" disabled={isPending}>
        <Input
          name="label"
          label="Label"
          type="text"
          defaultValue={label.display}
          required
        />
        <p className="-mt-2 mb-4 self-end text-sm italic">
          Suggested By:{" "}
          <a
            href={`/u/@${label.user.handle}`}
            target="_blank"
            className="hover:underline"
          >
            @{label.user.handle}
          </a>
        </p>

        <label
          htmlFor="delete-confirmation"
          className={cn("my-2 flex w-fit items-center gap-1", {
            "hover:cursor-pointer": !isPending,
          })}
        >
          <input
            id="delete-confirmation"
            type="checkbox"
            onClick={() => setConfirmDelete((prev) => !prev)}
            className="enabled:hover:cursor-pointer"
          />{" "}
          Checking this acknowledges your deletion request.
        </label>
        <div className="flex flex-col-reverse justify-end gap-2 md:flex-row">
          <button
            type="button"
            onClick={() => startTransition(() => onDelete())}
            className="reverse-btn bg-red-400 py-1 font-medium enabled:hover:bg-red-300 disabled:shadow-none"
            disabled={!confirmDelete}
          >
            Delete Label
          </button>
          <button
            type="submit"
            className="reverse-btn bg-purple-400 py-1 font-medium enabled:hover:bg-purple-300 disabled:shadow-none"
          >
            Update Label
          </button>
        </div>
      </fieldset>
    </form>
  );
}

/**
 * @description Gives the ability to update an indexed repository's
 *  "primary" label, "regular" labels, and maintain link alongside
 *  deleting indexed repositories.
 */
export function ManageRepoForm({
  repository,
  labels,
}: {
  repository: Omit<Repository, "languages" | "user">;
  labels: { regular: Option[]; primary: Option[] };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function onSubmit(formData: FormData) {
    formData.append("provider", repository.type);
    const cleanedData = formDataToObj(formData) as GenericObj;
    try {
      const data = await updateRepository(repository.id, cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully updated repository.");
    } catch (err) {
      toastSAErrors(err);
    }
  }

  async function onDelete() {
    if (!confirmDelete) return;
    try {
      const data = await deleteRepository(repository.id, repository.type);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully deleted repository.");
      router.refresh();
    } catch (err) {
      toastSAErrors(err);
    }
  }

  const usedLabels = repository.labels.map((rLb) => rLb.name);

  const initPrimaryLabel = labels.primary.find(
    (lb) => lb.value === repository.primaryLabel.name,
  ) ?? { name: "", value: "" };
  const initLabels = labels.regular.filter((lb) => {
    if (usedLabels.length > 0) return usedLabels.includes(lb.value);
    return false;
  });

  return (
    <form
      id="update-repo-form"
      action={(data) => startTransition(() => onSubmit(data))}
    >
      <fieldset className="flex flex-col" disabled={isPending}>
        <SearchSelect
          name="primary_label"
          label="Primary Label"
          options={labels.primary}
          formId="update-repo-form"
          initialValue={initPrimaryLabel}
        />
        <MultiSearchSelect
          name="labels"
          label="Labels"
          options={labels.regular}
          max={5}
          formId="update-repo-form"
          initialValues={initLabels}
          optional
        />
        <Input
          name="maintainLink"
          label="Maintain Link"
          type="url"
          defaultValue={repository.maintainLink ?? ""}
          description={
            <>
              Displayed if the primary label is set to {`"Abandoned"`}. This is
              a link to a repository that maintains this abandoned repository.
            </>
          }
        />

        <label
          htmlFor="delete-confirmation"
          className={cn("my-2 flex w-fit items-center gap-1", {
            "hover:cursor-pointer": !isPending,
          })}
        >
          <input
            id="delete-confirmation"
            type="checkbox"
            onClick={() => setConfirmDelete((prev) => !prev)}
            className="enabled:hover:cursor-pointer"
          />{" "}
          Checking this acknowledges your deletion request.
        </label>
        <div className="flex flex-col-reverse justify-end gap-2 md:flex-row">
          <button
            type="button"
            onClick={() => startTransition(() => onDelete())}
            className="reverse-btn bg-red-400 py-1 font-medium enabled:hover:bg-red-300 disabled:shadow-none"
            disabled={!confirmDelete}
          >
            Delete Repository
          </button>
          <button
            type="submit"
            className="reverse-btn bg-purple-400 py-1 font-medium enabled:hover:bg-purple-300 disabled:shadow-none"
          >
            Update Repository
          </button>
        </div>
      </fieldset>
    </form>
  );
}
