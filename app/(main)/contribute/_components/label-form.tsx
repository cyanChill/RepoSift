"use client";
import { useState, useTransition } from "react";
import Link from "next/link";

import SuccessWindow from "./success-window";
import { Input } from "@/components/form/input";

export default function LabelForm() {
  const [isComplete, setIsComplete] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function suggestLabel(formData: FormData) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsComplete(true);
        resolve("done");
      }, 2000);
    });
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
        action={(data) => startTransition(() => suggestLabel(data))}
        className="mt-8 md:max-w-[50%] md:px-12"
      >
        <fieldset disabled={isPending} className="flex flex-col">
          <Input type="text" name="label" label="Label" required />
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
