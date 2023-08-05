"use client";
import { forwardRef } from "react";

import {
  MinMaxRange,
  MultiSearchSelect,
  SearchSelect,
} from "@/components/form/custom";
import { avaliableProviders } from "@/lib/utils/constants";
import type { Option } from "@/components/form/utils";

type Props = {
  labels: { primary: Option[]; regular: Option[] };
  languages: Option[];
  values: {
    providers?: string[];
    languages?: string[];
    primary_label?: string;
    labels?: string;
    minStars?: number;
    maxStars?: number;
  };
  // action: (formData: FormData) => void;
  isSubmitting: boolean;
};

export default forwardRef<HTMLFormElement, Props>(function SearchForm(
  { labels, languages, values, isSubmitting },
  ref
) {
  /* 
    TODO: Need to populate the "initialValue/s" props after getting the
          physical values from the "values" prop
    
    TODO: Need to re-add the "action" prop
  */

  return (
    <form
      id="indexed-search-form"
      ref={ref}
      // action={action}
      className="md:px-12"
    >
      <fieldset disabled={isSubmitting}>
        <MultiSearchSelect
          name="providers"
          label="Specific Providers"
          options={avaliableProviders}
          max={3}
          formId="indexed-search-form"
          initialValues={[]}
        />
        <MultiSearchSelect
          name="languages"
          label="Languages"
          options={languages}
          max={5}
          formId="indexed-search-form"
          initialValues={[]}
        />
        <SearchSelect
          name="primary_label"
          label="Primary Label"
          options={labels.primary}
          initialValue={undefined}
          optional
        />
        <MultiSearchSelect
          name="labels"
          label="Labels"
          options={labels.regular}
          max={5}
          formId="indexed-search-form"
          initialValues={[]}
        />
        <MinMaxRange name="stars" label="Stars" />

        <div className="mt-8 flex items-center justify-end gap-2 font-medium">
          <button
            type="reset"
            className="btn just-black w-24 rounded-none bg-white py-1.5 disabled:bg-gray-200"
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn just-black w-24 rounded-none bg-purple-600 py-1.5 text-white disabled:bg-purple-400 disabled:text-black"
          >
            {!isSubmitting ? "Submit" : ". . ."}
          </button>
        </div>
      </fieldset>
    </form>
  );
});
