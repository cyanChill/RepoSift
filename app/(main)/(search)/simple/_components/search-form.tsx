"use client";
import { forwardRef } from "react";

import { Select } from "@/components/form/input";
import { MinMaxRange, MultiText } from "@/components/form/custom";

type Props = {
  action: (formData: FormData) => void;
  isSubmitting: boolean;
};

export default forwardRef<HTMLFormElement, Props>(function SearchForm(
  { action, isSubmitting },
  ref
) {
  return (
    <form id="simple-search-form" ref={ref} action={action}>
      <fieldset disabled={isSubmitting}>
        <Select
          name="provider"
          label="Search Provider"
          options={[
            { name: "GitHub", value: "github" },
            { name: "GitLab", value: "gitlab", disabled: true },
            { name: "Bitbucket", value: "bitbucket", disabled: true },
          ]}
        />
        <MultiText
          name="languages"
          label="Languages"
          max={5}
          formId="simple-search-form"
        />
        <MinMaxRange name="Stars" label="Stars" />

        <div className="flex justify-end gap-2 font-medium md:text-lg">
          <button
            type="reset"
            className="btn just-black rounded-none bg-white py-1.5"
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn just-black rounded-none bg-violet-700 py-1.5 text-white"
          >
            Search
          </button>
        </div>
      </fieldset>
    </form>
  );
});
