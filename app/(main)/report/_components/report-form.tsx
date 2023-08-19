"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { createReport } from "@/server-actions/createReport";

import type { GenericObj } from "@/lib/types";
import { formDataToObj } from "@/lib/utils/mutate";
import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import { Input } from "@/components/form/input";

type Props = {
  title: string;
  description: string;
};

export default function ReportForm({ title, description }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    const cleanedData = formDataToObj(formData) as GenericObj;
    try {
      const data = await createReport(cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      toast.success("Successfully submitted report.");
      router.back();
    } catch (err) {
      toastSAErrors(err);
    }
  }

  return (
    <form action={(data) => startTransition(() => onSubmit(data))}>
      <fieldset className="flex flex-col" disabled={isPending}>
        <Input
          name="title"
          label="Title"
          type="text"
          maxLength={100}
          description={
            <>
              Max <span className="font-semibold">100 characters</span> long.
            </>
          }
          defaultValue={title}
          placeholder="[Label Report] labelName"
          required
        />
        <div className="mb-4 flex flex-col">
          <label className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            rows={10}
            maxLength={2000}
            className="form-input resize-none"
            required
            defaultValue={description}
            placeholder="Please include all information relevant to your issue."
          />
          <p className="mt-2 text-xs sm:text-sm">
            Max <span className="font-semibold">2000 characters</span> long.
          </p>
        </div>
        <button
          type="submit"
          className="reverse-btn self-end bg-yellow-400 font-medium enabled:hover:bg-yellow-300"
        >
          Submit Report
        </button>
      </fieldset>
    </form>
  );
}
