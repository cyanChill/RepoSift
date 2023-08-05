"use client";
import { avaliableProviders } from "@/lib/utils/constants";
import { arrayTransform } from "@/lib/utils/mutate";
import {
  MinMaxRange,
  MultiSearchSelect,
  SearchSelect,
} from "@/components/form/custom";
import type { Option } from "@/components/form/utils";

type Props = {
  labels: { primary: Option[]; regular: Option[] };
  languages: Option[];
  values: {
    providers?: string;
    languages?: string;
    primary_label?: string;
    labels?: string;
    minStars?: string;
    maxStars?: string;
  };
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
  const arrayfiedValues = {
    providers: arrayTransform(values.providers ?? ""),
    languages: arrayTransform(values.languages ?? ""),
    labels: arrayTransform(values.labels ?? ""),
  };

  const initialProviders = avaliableProviders.filter((provider) =>
    arrayfiedValues.providers.includes(provider.value)
  );
  const initialLanguages = languages.filter((lang) =>
    arrayfiedValues.languages.includes(lang.value)
  );
  const initialPrimaryLabel = labels.primary.find(
    (lb) => lb.value === values.primary_label
  ) ?? { name: "", value: "" };
  const initialLabels = labels.regular.filter((lb) =>
    arrayfiedValues.labels.includes(lb.value)
  );

  return (
    <form id="indexed-search-form" action={action} className="md:px-12">
      <fieldset disabled={disabled}>
        <MultiSearchSelect
          name="providers"
          label="Specific Providers"
          options={avaliableProviders}
          max={3}
          formId="indexed-search-form"
          initialValues={initialProviders}
        />
        <MultiSearchSelect
          name="languages"
          label="Languages"
          options={languages}
          max={5}
          formId="indexed-search-form"
          initialValues={initialLanguages}
        />
        <SearchSelect
          name="primary_label"
          label="Primary Label"
          options={labels.primary}
          formId="indexed-search-form"
          initialValue={initialPrimaryLabel}
          optional
        />
        <MultiSearchSelect
          name="labels"
          label="Labels"
          options={labels.regular}
          max={5}
          formId="indexed-search-form"
          initialValues={initialLabels}
        />
        <MinMaxRange
          name="Stars"
          label="Stars"
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
