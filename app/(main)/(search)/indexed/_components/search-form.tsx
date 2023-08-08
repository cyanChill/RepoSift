"use client";
import { avaliableProviders } from "@/lib/utils/constants";

import {
  MinMaxRange,
  MultiSearchSelect,
  SearchSelect,
} from "@/components/form/custom";
import type { Option } from "@/components/form/utils";
import type { FilterParams } from "./utils";

type Props = {
  labels: { primary: Option[]; regular: Option[] };
  languages: Option[];
  values: FilterParams;
  action: (formData: FormData) => void;
  disabled: boolean;
};

export default function SearchForm({
  labels,
  languages,
  values,
  action,
  disabled,
}: Props) {
  const initProviders = avaliableProviders.filter((provider) => {
    if (values.providers) return values.providers.includes(provider.value);
    return false;
  });
  const initLanguages = languages.filter((lang) => {
    if (values.languages) return values.languages.includes(lang.value);
    return false;
  });
  const initPrimaryLabel = labels.primary.find(
    (lb) => lb.value === values.primary_label,
  ) ?? { name: "", value: "" };
  const initLabels = labels.regular.filter((lb) => {
    if (values.labels) return values.labels.includes(lb.value);
    return false;
  });

  return (
    <form id="indexed-search-form" action={action} className="md:px-12">
      <fieldset disabled={disabled}>
        <MultiSearchSelect
          name="providers"
          label="Specific Providers"
          options={avaliableProviders}
          max={3}
          formId="indexed-search-form"
          initialValues={initProviders}
        />
        <MultiSearchSelect
          name="languages"
          label="Languages"
          options={languages}
          max={5}
          formId="indexed-search-form"
          initialValues={initLanguages}
        />
        <SearchSelect
          name="primary_label"
          label="Primary Label"
          options={labels.primary}
          formId="indexed-search-form"
          initialValue={initPrimaryLabel}
          optional
        />
        <MultiSearchSelect
          name="labels"
          label="Labels"
          options={labels.regular}
          max={5}
          formId="indexed-search-form"
          initialValues={initLabels}
        />
        <MinMaxRange
          name="Stars"
          label="Stars"
          formId="indexed-search-form"
          initialMin={values.minStars}
          initialMax={values.maxStars}
        />

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
            {!disabled ? "Submit" : ". . ."}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
