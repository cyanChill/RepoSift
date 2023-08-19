"use client";
import { useState, useTransition } from "react";
import Link from "next/link";

import { createRepository } from "@/server-actions/createRepository";

import type { GenericObj } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LIMITS, PATTERNS, avaliableProviders } from "@/lib/utils/constants";
import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import { formDataToObj } from "@/lib/utils/mutate";
import { Input, Select } from "@/components/form/input";
import { MultiSearchSelect, SearchSelect } from "@/components/form/custom";
import type { Option } from "@/components/form/utils";
import SuccessWindow from "./success-window";

type Props = {
  labels: { primary: Option[]; regular: Option[] };
};

export default function RepositoryForm({ labels }: Props) {
  const [isComplete, setIsComplete] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function indexRepository(formData: FormData) {
    const cleanedData = formDataToObj(formData) as GenericObj;
    try {
      const data = await createRepository(cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      setIsComplete(true);
    } catch (err) {
      toastSAErrors(err);
    }
  }

  if (isComplete) {
    return <SuccessWindow variant="repository" />;
  }

  return (
    <section className="w-full md:mx-8">
      <Link
        href="/contribute"
        className="btn just-black rounded-none bg-error py-1.5 font-medium text-white md:text-lg"
      >
        Back
      </Link>

      <form
        id="repository-form"
        action={(data) => startTransition(() => indexRepository(data))}
        className="mt-8 md:max-w-[50%] md:px-12"
      >
        <fieldset disabled={isPending} className="flex flex-col">
          <Select
            name="provider"
            label="Repository Provider"
            options={avaliableProviders}
            flow={false}
          />

          <div className="flex flex-col md:flex-row">
            <Input
              name="author"
              label="Repository Author"
              min={1}
              max={LIMITS.GITHUB_USERNAME}
              pattern={PATTERNS.GITHUB_USERNAME}
              required
            />
            <p
              className={cn(
                "form-input mb-4 hidden h-10 self-end border-x-0 md:block",
                { "bg-gray-200 text-opacity-75": isPending },
              )}
            >
              /
            </p>
            <Input
              name="name"
              label="Repository Name"
              min={1}
              max={LIMITS.GITHUB_REPONAME}
              pattern={PATTERNS.GITHUB_REPONAME}
              required
            />
          </div>

          <SearchSelect
            name="primary_label"
            label="Primary Label"
            options={labels.primary}
            formId="repository-form"
          />
          <MultiSearchSelect
            name="labels"
            label="Labels"
            options={labels.regular}
            formId="repository-form"
            max={5}
            optional
          />

          <button
            type="submit"
            className="btn just-black mt-8 w-24 self-end rounded-none bg-purple-600 py-1.5 font-medium text-white disabled:bg-purple-400 disabled:text-black md:text-lg"
          >
            {!isPending ? "Submit" : ". . ."}
          </button>
        </fieldset>
      </form>
    </section>
  );
}
