"use client";
import { useState, useTransition } from "react";
import Link from "next/link";

import { createLabel } from "@/server-actions/createLabel";

import { LIMITS, PATTERNS } from "@/lib/utils/constants";
import { throwSAErrors, toastSAErrors } from "@/lib/utils/error";
import { Input } from "@/components/form/input";
import SuccessWindow from "./success-window";

export default function LabelForm() {
  const [isComplete, setIsComplete] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function suggestLabel(formData: FormData) {
    try {
      const data = await createLabel(formData.get("label") as string);
      if (!data) throw new Error("Something unexpected occurred.");
      throwSAErrors(data.error);
      setIsComplete(true);
    } catch (err) {
      toastSAErrors(err);
    }
  }

  if (isComplete) {
    return <SuccessWindow variant="label" />;
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
        id="label-form"
        action={(data) => startTransition(() => suggestLabel(data))}
        className="mt-8 md:max-w-[50%] md:px-12"
      >
        <fieldset disabled={isPending} className="flex flex-col">
          <Input
            type="text"
            name="label"
            label="Label"
            minLength={3}
            maxLength={LIMITS.LABEL}
            pattern={PATTERNS.LABEL}
            description={
              <span>
                Can only contain{" "}
                <span className="font-semibold">
                  letters (A-Z), periods & hyphens (.-), spaces
                </span>{" "}
                and be{" "}
                <span className="font-semibold">
                  3-{LIMITS.LABEL} characters
                </span>{" "}
                long.
              </span>
            }
            required
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
