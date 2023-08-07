import { useState, useRef, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import { toast } from "react-hot-toast";

import { useFormReset } from "@/hooks/useFormReset";
import type { Option } from "./utils";
import { getFilteredOptions, FormValue, ItemsList } from "./utils";
import { cn } from "@/lib/utils";

type MMRProps = {
  name: string;
  label: string;
  initialMin?: number | string;
  initialMax?: number | string;
};

/** Form field names will be `min${name}` & `min${name}` */
export const MinMaxRange = ({
  name,
  label,
  initialMin,
  initialMax,
}: MMRProps) => {
  return (
    <fieldset className="mb-4 flex flex-col">
      <legend className="form-label">{label}</legend>

      <div className="flex items-center gap-4">
        <label htmlFor={`min${name}`} className="sr-only">
          min{label}
        </label>
        <input
          id={`min${name}`}
          name={`min${name}`}
          type="number"
          min={0}
          step={1}
          defaultValue={initialMin}
          className="form-input w-full max-w-[6rem]"
        />

        <span className="block h-1.5 w-4 bg-black" />

        <label htmlFor={`max${name}`} className="sr-only">
          max{label}
        </label>
        <input
          id={`max${name}`}
          name={`max${name}`}
          type="number"
          min={0}
          step={1}
          defaultValue={initialMax}
          className="form-input w-full max-w-[6rem]"
        />
      </div>
    </fieldset>
  );
};

type MultiTextProps = {
  name: string;
  label: string;
  /** A positive integer. */
  max: number;
  formId: string;
  optional?: boolean;
  initialValues?: string[];
};

export const MultiText = ({
  name,
  label,
  max,
  formId,
  optional,
  initialValues,
}: MultiTextProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [vals, setVals] = useState<string[]>(initialValues ?? []);
  useFormReset(() => setVals([]), formId);

  const onAdd = () => {
    if (!inputRef.current) return;
    if (vals.length >= max) {
      toast.error("Maximum number of values selected.");
      return;
    }
    const newVal = inputRef.current.value.trim();
    if (newVal.length > 0) setVals((prev) => [...new Set([...prev, newVal])]);
    inputRef.current.value = "";
  };

  const removeSelf = (self: string) => {
    setVals((prev) => prev.filter((val) => val !== self));
  };

  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={name} className="form-label">
        {label}{" "}
        <span className="ml-2 font-normal">
          (max {max}){" "}
          {optional && (
            <>
              - <span className="italic">Optional</span>
            </>
          )}
        </span>
      </label>
      <FormValue name={name} value={JSON.stringify(vals)} />

      <div className="mb-2 flex h-9 items-center md:h-10">
        <input
          type="text"
          maxLength={25}
          className="form-input w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          ref={inputRef}
        />
        <button
          type="button"
          className="form-input aspect-square h-full border-l-0 bg-yellow-400 font-semibold transition duration-300 enabled:hocus:bg-yellow-300"
          onClick={onAdd}
        >
          +
        </button>
      </div>

      {/* List of inputted items */}
      <ItemsList values={vals} onDelete={removeSelf} />
    </div>
  );
};

type SearchSelectProps = {
  name: string;
  label: string;
  options: Option[];
  formId: string;
  initialValue?: Option;
  flow?: boolean;
  optional?: boolean;
};

export const SearchSelect = ({
  name,
  label,
  options,
  formId,
  initialValue,
  flow = true,
  optional = false,
}: SearchSelectProps) => {
  const [selectedOpt, setSelectedOpt] = useState<Option>(
    initialValue ?? (optional ? { name: "", value: "" } : options[0])
  );
  const [query, setQuery] = useState("");
  useFormReset(() => {
    optional ? setSelectedOpt({ name: "", value: "" }) : null;
  }, formId);

  const filteredOptions = getFilteredOptions(query, options);

  return (
    <Combobox
      as="div"
      className={cn("relative mb-4 w-full", { "max-w-max": !flow })}
      value={selectedOpt}
      onChange={setSelectedOpt}
      // @ts-ignore: Boolean value is acceptable
      nullable={optional}
    >
      <FormValue
        name={name}
        value={selectedOpt ? selectedOpt.value : ""}
      />

      <Combobox.Label className="form-label">{label}</Combobox.Label>
      <fieldset className="form-input flex w-full items-center gap-2 text-start">
        <Combobox.Input
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(opt: Option) => opt?.name}
          className="w-full outline-none"
        />
        <Combobox.Button>
          <FaChevronDown className="pointer-events-none" />
        </Combobox.Button>
      </fieldset>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="absolute bottom-0 left-0 z-10 max-h-40 w-full translate-y-full overflow-auto border-2 border-black bg-white">
          {filteredOptions.map((opt) => (
            <Combobox.Option
              as={Fragment}
              key={opt.value}
              value={opt}
              disabled={opt.disabled}
            >
              {({ active, selected, disabled }) => (
                <li
                  className={cn("relative cursor-default px-2 py-1 pl-10", {
                    "bg-indigo-600 text-white": active,
                    "font-medium": selected,
                    "text-gray-300": disabled,
                  })}
                >
                  {opt.name}
                  {selected && (
                    <FaCheck className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 pl-3" />
                  )}
                </li>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
};

type MSSProps = {
  name: string;
  label: string;
  options: Option[];
  initialValues?: Option[];
  /** A positive integer. */
  max: number;
  formId: string;
  optional?: boolean;
  flow?: boolean; // Max-Content or Width 100%
};

export const MultiSearchSelect = ({
  name,
  label,
  options,
  initialValues,
  max,
  formId,
  optional,
  flow = true,
}: MSSProps) => {
  const [vals, setVals] = useState<Option[]>(initialValues ?? []);
  const [query, setQuery] = useState("");
  useFormReset(() => setVals([]), formId);

  const filteredOptions = getFilteredOptions(query, options);

  const toggleOption = (newOpt: Option) => {
    // Remove option if already selected
    const exists = vals.find((opt) => opt.value === newOpt.value);
    if (exists) {
      setVals((prev) => prev.filter((opt) => opt.value !== newOpt.value));
      return;
    }
    // Handle if we reached the max number of selecetd options
    if (vals.length >= max) {
      toast.error("Maximum number of values selected.");
      return;
    }
    setVals((prev) => [...prev, newOpt]);
  };

  const removeSelf = (self: string) => {
    setVals((prev) => prev.filter((val) => val.name !== self));
  };

  return (
    <div className={cn("mb-4 w-full", { "max-w-max": !flow })}>
      <FormValue
        name={name}
        value={JSON.stringify(vals.map((val) => val.value))}
      />

      <Combobox as="div" onChange={toggleOption} className="relative">
        <Combobox.Label className="form-label">
          {label}{" "}
          <span className="ml-2 font-normal">
            (max {max}){" "}
            {optional && (
              <>
                - <span className="italic">Optional</span>
              </>
            )}
          </span>
        </Combobox.Label>
        <fieldset className="form-input flex w-full items-center gap-2 text-start">
          <Combobox.Input
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none"
          />
          <Combobox.Button>
            <FaChevronDown className="pointer-events-none" />
          </Combobox.Button>
        </fieldset>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute bottom-0 left-0 z-10 max-h-40 w-full translate-y-full overflow-auto border-2 border-black bg-white">
            {filteredOptions.map((opt) => (
              <Combobox.Option
                as={Fragment}
                key={opt.value}
                value={opt}
                disabled={opt.disabled}
              >
                {({ active, disabled }) => {
                  const selected = vals.find(
                    (selOpt) => selOpt.value === opt.value
                  );

                  return (
                    <li
                      className={cn("relative cursor-default px-2 py-1 pl-10", {
                        "bg-indigo-600 text-white": active,
                        "font-medium": selected,
                        "text-gray-300": disabled,
                      })}
                    >
                      {opt.name}
                      {selected && (
                        <FaCheck className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 pl-3" />
                      )}
                    </li>
                  );
                }}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </Combobox>

      {/* List of inputted items */}
      <ItemsList
        values={vals.map((val) => val.name)}
        onDelete={removeSelf}
        className={cn({ "mt-2": vals.length !== 0 })}
      />
    </div>
  );
};
