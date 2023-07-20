"use client";
// import { experimental_useFormStatus as useFormStatus } from "react-dom";

import { simpleSearch } from "@/server-actions/simple-search";
import { Select } from "@/components/form/input";
import { MinMaxRange, MultiText } from "@/components/form/custom";

export default function SSClientPage() {
  // const { pending } = useFormStatus();

  return (
    <div>
      <form id="simple-search-form" className="border-2 border-black p-4">
        {/* <form
        id="simple-search-form"
        action={simpleSearch}
        className="border-2 border-black p-4"
      > */}
        <Select
          name="provider"
          label="Search Provider"
          options={[
            { name: "GitHub", value: "github" },
            { name: "GitLab", value: "gitlab", disabled: true },
            { name: "Bitbucket", value: "bitbucket", disabled: true },
          ]}
        />
        <MultiText name="languages" label="Languages" max={5} />
        <MinMaxRange name="Stars" label="Stars" />

        <div className="flex justify-end gap-2 font-medium md:text-lg">
          <button
            type="reset"
            className="btn just-black rounded-none bg-white py-1.5"
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn just-black rounded-none bg-violet-700 py-1.5 text-white"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
