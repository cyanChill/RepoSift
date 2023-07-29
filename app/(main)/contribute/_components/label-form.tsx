"use client";
import { useState, useTransition } from "react";
import Link from "next/link";

import { createLabel } from "@/server-actions/label-actions";
import type { GenericObj } from "@/lib/types";
import { formDataToObj, getErrMsg } from "@/lib/utils";
import SuccessWindow from "./success-window";
import { Input } from "@/components/form/input";

export default function LabelForm() {
  const [isComplete, setIsComplete] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function suggestLabel(formData: FormData) {
    const cleanedData = formDataToObj(formData) as GenericObj;
    try {
      const data = await createLabel(cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      console.log(data);
      setIsComplete(true);
    } catch (err) {
      console.log("[Error] " + getErrMsg(err));
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
            maxLength={25}
            pattern="[A-Za-z.\-\s]{3,25}"
            description={
              <span>
                Can only contain{" "}
                <span className="font-semibold">
                  letters (A-Z), periods & hyphens (.-), spaces
                </span>{" "}
                and be <span className="font-semibold">3-25 characters</span>{" "}
                long.
              </span>
            }
            required
          />
          <button
            type="submit"
            className="btn just-black w-24 self-end rounded-none bg-purple-600 py-1.5 font-medium text-white disabled:bg-purple-400 disabled:text-black md:text-lg"
          >
            {!isPending ? "Submit" : ". . ."}
          </button>
        </fieldset>
      </form>
    </section>
  );
}
